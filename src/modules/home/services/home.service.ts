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
import { EmailQueueService } from '../../../queues/email/email.queue.service';
import { EmailOptionsDto } from '../../../core/email/dto/email.options.dto';
import { UpdateHomeDto } from '../dto/update-home.dto';
import { isEmpty } from 'lodash';
import { Home, HomeAdmin } from '../models';
import { PaginationFiltersDto } from '../../../common/dto/filters/pagination-filters.dto';
import { InferAttributes, Op, WhereOptions } from 'sequelize';

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
    private readonly emailQueueService: EmailQueueService,
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
      const emailOptions: EmailOptionsDto = {
        to: adminContact.emailAddress,
        subject: 'Your login credentials',
        templateName: 'user-login-credentials',
        context: {
          homeName: payload.name,
          email: adminContact.emailAddress,
          password,
          recipientName: `${adminContact.firstName} ${adminContact.lastName}`,
          loginUrl: '',
        },
      };

      void this.emailQueueService.dispatchEmailJob(emailOptions);

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

  async updateHome(homeId: number, dto: UpdateHomeDto): Promise<any> {
    if (!Object.values(dto).some((value) => value !== undefined)) {
      throw new BadRequestException('At least one property is required');
    }

    let home = await this.repo.findOneById(homeId);
    if (!home) throw new NotFoundException('Home not found');

    if (dto.name && dto.address) {
      const homeFound = await this.repo.findOneByCondition({
        name: dto.name,
        address: dto.address,
      });
      if (homeFound && homeFound.id !== home.id) {
        throw new BadRequestException(
          'A home with this address already exists',
        );
      }
    }

    if (dto.name) dto.name = this.util.capitalizeFirstLetters(dto.name);
    try {
      home = await this.repo.update(homeId, dto);

      return successResponse(
        ResponseCode.OK,
        home,
        'Successfully updated home',
      );
    } catch (e) {
      this.logger.error(`Unable to update home ${dto.name ?? home?.name}`, e);
      throw new InternalServerErrorException('Error updating home');
    }
  }

  async deleteHome(homeId: number): Promise<any> {
    const home = await this.repo.findOneById(homeId);
    if (!home) throw new NotFoundException('Home not found');
    const t = await this.sequelize.transaction();
    try {
      // Fetch home admins for this home
      const homeAdmins = await HomeAdmin.findAll({
        where: { homeId },
        attributes: ['authUserId'],
        transaction: t,
      });

      const authUserIds = homeAdmins.map((a) => a.authUserId).filter(Boolean);

      // Delete home admins
      await HomeAdmin.destroy({ where: { homeId }, transaction: t });

      // 3. Delete auth users linked to those home admins
      if (authUserIds.length > 0) {
        await AuthUser.destroy({
          where: { id: authUserIds },
          transaction: t,
          force: true,
        });
      }

      await home.destroy({ force: true, transaction: t });

      await t.commit();

      return successResponse(
        ResponseCode.OK,
        null,
        `Successfully deleted ${home.name}`,
      );
    } catch (e) {
      await t.rollback();
      this.logger.error(`Unable to delete home ${home.name}`, e);
      throw new InternalServerErrorException(
        `Error deleting home ${home.name}`,
      );
    }
  }

  async findHome(homeId: number): Promise<any> {
    const home = await this.repo.findOneById(homeId, {
      include: this.repo.getRelationships(),
    });

    if (!home) throw new NotFoundException('Home not found');

    return successResponse(ResponseCode.OK, home, 'Home details found');
  }

  async getHomes(filter: PaginationFiltersDto): Promise<any> {
    const { size, searchTerm, cursor } = filter;

    const where: WhereOptions<InferAttributes<Home>> = {};

    if (searchTerm) {
      const like = `%${searchTerm}%`;

      where[Op.or] = [
        { name: { [Op.like]: like } },
        { address: { [Op.like]: like } },
        { city: { [Op.like]: like } },
        { state: { [Op.like]: like } },
        { country: { [Op.like]: like } },
        { landmark: { [Op.like]: like } },
        { websiteUrl: { [Op.like]: like } },
      ];
    }

    const records = await this.repo.findWithCursorPagination({
      limit: size,
      cursor,
      cursorField: 'updatedAt',
      orderDirection: 'DESC',
      where,
      include: this.repo.getRelationships(),
    });

    return successResponse(ResponseCode.OK, records, 'Homes');
  }
}
