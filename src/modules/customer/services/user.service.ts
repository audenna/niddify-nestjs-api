import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AppLogger } from '../../../core/logger/logger.service';
import { UserRepository } from '../repositories';
import { AuthUserRepository } from '../../auth-user/repositories/auth.user.repository';
import { DateUtil, HashUtil, PhoneUtil, Util } from '../../../common/utils';
import { Sequelize } from 'sequelize-typescript';
import { AuthUser } from '../../auth-user/models/auth.user.model';
import { Transaction } from 'sequelize';
import { successResponse } from '../../../common/dto/api-response/api.response.handler';
import { ResponseCode, UserPresenceStatusEnum } from '../../../common/enums';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { CreateAccountDeactivationDto } from '../dto/create-account-deactivation.dto';
import { AccountBlockingAction } from '../enums/account-blocking-action.enum';
import { RefreshToken } from '../../refresh-token/models/refresh.token.model';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: AppLogger,
    private readonly userRepo: UserRepository,
    private readonly authUserRepo: AuthUserRepository,
    private readonly util: Util,
    private readonly phoneUtil: PhoneUtil,
    private readonly sequelize: Sequelize,
    private readonly dateUtil: DateUtil,
    private readonly hasUtil: HashUtil,
  ) {
    this.logger = logger.withContext(UserService.name);
  }

  async createProfile(
    authUser: AuthUser,
    transaction?: Transaction,
    profilePic: string | null = null,
  ): Promise<void> {
    try {
      const payload = { authUserId: +authUser.id, profilePic };
      await this.userRepo.create(payload, transaction);
    } catch (e) {
      this.logger.log('Unable to register a new user account');
      this.logger.error(e);
    }
  }

  getLoggedInProfile(authenticatedUser: AuthUser): any {
    return successResponse(ResponseCode.OK, authenticatedUser, 'User profile');
  }

  async updateProfile(
    authUser: AuthUser,
    payload: UpdateProfileDto,
  ): Promise<any> {
    this.logger.log(`Updating customer's profile account...`);
    this.util.ensureAtLeastOneFieldProvided(payload);

    if (!authUser.user) {
      this.logger.warn('No customer account found for the logged-in customer!');
      throw new BadRequestException('Oops! Something went wrong!');
    }

    const { dateOfBirth, ...updatedPayload } = payload;

    if (payload.phoneNumber) {
      updatedPayload.phoneNumber = payload.phoneNumber
        ? this.phoneUtil.getPhoneNumberWithDialingCode(payload.phoneNumber)
        : payload.phoneNumber;

      if (
        await this.authUserRepo.findOneByCondition({
          phoneNumber: updatedPayload.phoneNumber,
        })
      ) {
        throw new BadRequestException('Phone number is already in use');
      }
    }

    const transaction = await this.sequelize.transaction();
    try {
      if (dateOfBirth) {
        await this.userRepo.update(
          +authUser.user.id,
          { dateOfBirth },
          transaction,
        );
      }

      if (Object.values(updatedPayload).length > 0) {
        await this.authUserRepo.update(
          +authUser.id,
          updatedPayload,
          transaction,
        );
      }

      await transaction.commit();

      const user = await this.authUserRepo.findAuthUserWithProfileByType(
        +authUser.id,
      );

      return successResponse(
        ResponseCode.OK,
        user,
        'Profile updated successfully',
      );
    } catch (e) {
      this.logger.error('An error occurred while updating profile account');
      this.logger.error(e);
      await transaction.rollback();
      throw new InternalServerErrorException(
        'An error occurred while updating profile account',
      );
    }
  }

  async deactivateOrDeleteAccount(
    user: AuthUser,
    dto: CreateAccountDeactivationDto,
  ): Promise<any> {
    const userId = +user.id;
    const profile = await this.authUserRepo.findOneById(userId);
    if (!profile) throw new UnauthorizedException('Profile not found!');

    if (
      !(await this.hasUtil.comparePassword(dto.password, profile.passwordHash))
    ) {
      throw new BadRequestException('Invalid password!');
    }
    const transaction = await this.sequelize.transaction();
    try {
      if (dto.requestType === AccountBlockingAction.DELETE) {
        await profile.destroy({ force: true, transaction });
      } else {
        await this.authUserRepo.update(
          userId,
          {
            presenceStatus: UserPresenceStatusEnum.DEACTIVATED,
            remarks: dto.remark,
          },
          transaction,
        );
      }

      await RefreshToken.destroy({
        where: { authUserId: userId },
        transaction,
      });

      await transaction.commit();

      return successResponse(
        ResponseCode.OK,
        { logoutTheUser: true },
        'Request successful',
      );
    } catch (e) {
      await transaction.rollback();
      this.logger.error('An error occurred while deactivateOrDeleteAccount');
      this.logger.error(e);
      throw new InternalServerErrorException(
        'An error occurred while processing your request',
      );
    }
  }
}
