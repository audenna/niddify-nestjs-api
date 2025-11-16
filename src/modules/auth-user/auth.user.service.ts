import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AuthUserRepository } from './repositories/auth.user.repository';
import { HashUtil, Util } from '../../common/utils';
import { AppLogger } from '../../core/logger/logger.service';
import { AuthUser } from './models/auth.user.model';
import { Transaction } from 'sequelize';
import {
  RegTypeEnum,
  ResponseCode,
  UserPresenceStatusEnum,
} from '../../common/enums';
import { CreateUserDto } from '../auth/dto/user/create-user.dto';
import { UserTypes } from '../../common/enums/user.types';
import { AppConfigService } from '../../config/app/app.config.service';
import { successResponse } from '../../common/dto/api-response/api.response.handler';

@Injectable()
export class AuthUserService {
  constructor(
    private readonly authUserRepo: AuthUserRepository,
    private readonly util: Util,
    private logger: AppLogger,
    private readonly appConfig: AppConfigService,
    private readonly hashUtil: HashUtil,
  ) {
    this.logger = logger.withContext(AuthUserService.name);
  }

  async getLoggedInProfile(authenticatedUser: AuthUser): Promise<any> {
    const user = await this.authUserRepo.findAuthUserWithProfileByType(
      +authenticatedUser.id,
    );

    if (!user) throw new ForbiddenException('Account does not exist');

    return successResponse(ResponseCode.OK, user, 'Profile information');
  }

  async createUser(
    dto: CreateUserDto,
    userType: UserTypes,
    transaction?: Transaction,
    presenceStatus?: UserPresenceStatusEnum,
    regType?: RegTypeEnum,
  ): Promise<AuthUser> {
    this.logger.log('Creating a new user account...', { dto, userType });

    const payload = {
      userType,
      phoneNumber: dto.phoneNumber,
      username: dto.emailAddress,
      emailAddress: dto.emailAddress,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      passwordHash: dto['passwordHash'] ?? null,
      presenceStatus: presenceStatus ?? UserPresenceStatusEnum.VERIFY_ACCOUNT,
      firstName: dto.firstName,
      lastName: dto.lastName,
      signupChannel: regType ?? RegTypeEnum.NORMAL_AUTH,
      hasVerifiedOTP: regType !== RegTypeEnum.NORMAL_AUTH,
    };

    return await this.authUserRepo.create(payload, transaction);
  }

  async toggleAccountSuspension(authUserId: number): Promise<any> {
    // if (isNaN(authUserId)) throw new BadRequestException('Invalid user');
    //
    // const user = await this.authUserRepo.findOneById(authUserId);
    //
    // if (!user) {
    //   throw new NotFoundException('User account does not exist');
    // }
    //
    // const isBlocked = user.presenceStatus === UserPresenceStatusEnum.DEACTIVATED;
    // let previousStatus = UserPresenceStatusEnum.ACTIVE;
    //
    // if (!user.hasVerifiedOTP) {
    //   previousStatus = UserPresenceStatusEnum.VERIFY_ACCOUNT;
    // } else if (!user.passwordHash) {
    //   previousStatus = UserPresenceStatusEnum.CREATE_PASSWORD;
    // }
    //
    // try {
    //   await this.authUserRepo.update(authUserId, {
    //     presenceStatus: !isBlocked
    //       ? UserPresenceStatusEnum.DEACTIVATED
    //       : previousStatus,
    //   });
    //
    //   return successResponse(
    //     ResponseCode.OK,
    //     null,
    //     isBlocked ? 'User successfully unblocked' : 'User successfully blocked',
    //   );
    // } catch (e) {
    //   this.logger.error(
    //     'An error occurred while updating a User presence status',
    //   );
    //   this.logger.error(e);
    //   throw new InternalServerErrorException(
    //     'An error occurred. Try again later',
    //   );
    // }
  }
}
