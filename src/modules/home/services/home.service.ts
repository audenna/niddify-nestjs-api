import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  HomeAdminRepository,
  HomeContactRepository,
  HomeCoverPhotoRepository,
  HomeRepository,
  HomeTypeRepository,
} from '../repositories';
import { HashUtil, PhoneUtil, Util } from '../../../common/utils';
import { AppLogger } from '../../../core/logger/logger.service';
import { AuthUser } from '../../auth-user/models/auth.user.model';
import { CreateHomeDto } from '../dto/create-home.dto';
import { FileUploadService } from '../../../core/file-upload/file-upload.service';
import { Sequelize } from 'sequelize-typescript';
import { FileUploadResult } from '../../../core/file-upload/interfaces/file-upload-provider.interface';
import { successResponse } from '../../../common/dto/api-response/api.response.handler';
import {
  RegTypeEnum,
  ResponseCode,
  UserPresenceStatusEnum,
} from '../../../common/enums';
import { AuthUserRepository } from '../../auth-user/repositories/auth.user.repository';
import { UserTypes } from '../../../common/enums/user.types';
import { HomeContactType } from '../enums/home-contact-type.enum';
import { IHomeContact } from '../interfaces/home.interface';

@Injectable()
export class HomeService {
  constructor(
    private readonly repo: HomeRepository,
    private readonly homeCoverPhotoRepo: HomeCoverPhotoRepository,
    private readonly typeRepository: HomeTypeRepository,
    private readonly homeAdminRepo: HomeAdminRepository,
    private readonly authUserRepo: AuthUserRepository,
    private readonly homeContactRepo: HomeContactRepository,
    private readonly util: Util,
    private readonly logger: AppLogger,
    private readonly uploadService: FileUploadService,
    private readonly sequelize: Sequelize,
    private readonly hashUtil: HashUtil,
    private readonly phoneUtil: PhoneUtil,
  ) {
    this.logger = logger.withContext('HomeService');
  }

  private async validateHomeOnboarding(
    dto: CreateHomeDto,
    logoFile: Express.Multer.File,
    coverPhotos: Express.Multer.File[] = [],
  ): Promise<void> {
    if (!logoFile) {
      throw new BadRequestException('A logo file is required');
    }

    if (!coverPhotos.length) {
      throw new BadRequestException('At least one cover photo is required');
    }

    dto.name = this.util.capitalizeFirstLetters(dto.name);
    dto.state = this.util.capitalizeFirstLetters(dto.state);
    dto.city = this.util.capitalizeFirstLetters(dto.city);
    dto.country = this.util.capitalizeFirstLetters(dto.country);

    dto.adminContact.emailAddress = this.util.convertToLowercase(
      dto.adminContact.emailAddress,
    );

    dto.adminContact.firstName = this.util.capitalizeFirstLetters(
      dto.adminContact.firstName,
    );

    dto.adminContact.lastName = this.util.capitalizeFirstLetters(
      dto.adminContact.lastName,
    );

    if (dto.contactEmailAddress) {
      dto.contactEmailAddress = this.util.convertToLowercase(
        dto.contactEmailAddress,
      );
    }

    if (dto.contactPhoneNumber) {
      dto.contactPhoneNumber = this.phoneUtil.getPhoneNumberWithDialingCode(
        dto.contactPhoneNumber,
      );
    }

    dto.adminContact.phoneNumber = this.phoneUtil.getPhoneNumberWithDialingCode(
      dto.adminContact.phoneNumber,
    );

    this.logger.log(`Adding new home ${dto.name}`, dto);

    if (
      await this.repo.findOneByCondition({
        name: dto.name,
        address: dto.address,
      })
    ) {
      throw new BadRequestException(
        `Home name already exists for: ${dto.address}`,
      );
    }

    if (
      await this.authUserRepo.findOneByCondition({
        emailAddress: dto.adminContact.emailAddress,
      })
    ) {
      throw new BadRequestException(
        `Email already exists for: ${dto.adminContact.emailAddress}`,
      );
    }

    if (
      await this.authUserRepo.findOneByCondition({
        phoneNumber: dto.adminContact.phoneNumber,
      })
    ) {
      throw new BadRequestException(
        `Phone number already exists for: ${dto.adminContact.phoneNumber}`,
      );
    }

    // throw new BadRequestException('Everything is already in use');
  }

  async addHome(
    user: AuthUser,
    dto: CreateHomeDto,
    logoFile: Express.Multer.File,
    coverPhotos: Express.Multer.File[] = [],
  ): Promise<any> {
    // Sanitize the submitted input
    await this.validateHomeOnboarding(dto, logoFile, coverPhotos);

    const {
      homeTypeUuid,
      adminContact,
      contactEmailAddress,
      contactPhoneNumber,
      ...payload
    } = dto;

    const type = await this.typeRepository.findOneByCondition({
      uuid: homeTypeUuid,
    });
    if (!type) throw new NotFoundException('Invalid home type');

    // Upload files to the cloud in parallel
    const [logoRes, covers] = await Promise.all([
      this.uploadService.handleFileUpload(logoFile),
      this.uploadService.handleMultipleUploads(coverPhotos),
    ]);

    payload.logoUrl = logoRes?.url;
    payload['createdById'] = Number(user.id);
    payload['typeId'] = Number(type.id);

    const transaction = await this.sequelize.transaction();
    try {
      const home = await this.repo.create(payload, transaction);

      const coverPhotos = covers.map((file: FileUploadResult) => ({
        homeId: Number(home.id),
        imageUrl: file.url,
      }));

      await this.homeCoverPhotoRepo.createMany(coverPhotos, { transaction });

      // Create the contacts
      const contacts: IHomeContact[] = [];
      if (contactEmailAddress) {
        contacts.push({
          homeId: Number(home.id),
          type: HomeContactType.email,
          value: contactEmailAddress,
        });
      }

      if (contactPhoneNumber) {
        contacts.push({
          homeId: Number(home.id),
          type: HomeContactType.phone,
          value: contactPhoneNumber,
        });
      }

      if (contacts.length) {
        await this.homeContactRepo.createMany(contacts, { transaction });
      }

      const password = this.util.generateRandomReferralCode(10);

      // Create the contact person record
      const authUser = await this.authUserRepo.create(
        {
          username: adminContact.emailAddress,
          userType: UserTypes.HOME_ADMIN,
          firstName: adminContact.firstName,
          lastName: adminContact.lastName,
          passwordHash: await this.hashUtil.hashPassword(password),
          emailAddress: adminContact.emailAddress,
          phoneNumber: adminContact.phoneNumber,
          presenceStatus: UserPresenceStatusEnum.VERIFY_ACCOUNT,
          signupChannel: RegTypeEnum.ADMIN_CREATION,
        },
        transaction,
      );

      await this.homeAdminRepo.create(
        {
          homeId: +home.id,
          authUserId: +authUser.id,
          isCreator: true,
        },
        transaction,
      );

      await transaction.commit();

      const newHome = await this.repo.findOneById(Number(home.id), {
        include: this.repo.getRelationships(),
      });

      // Send an email with the login credentials to the admin contact email

      return successResponse(
        ResponseCode.OK,
        newHome,
        'A new home has been added successfully.',
      );
    } catch (e) {
      await transaction.rollback();
      this.logger.error(`Unable to add a new home ${payload.name}`, e);
      throw new InternalServerErrorException('Error adding a new home');
    }
  }
}
