import { AppLogger } from '../../core/logger/logger.service';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DateUtil, HashUtil, PhoneUtil, Util } from '../../common/utils';
import { AuthUserRepository } from '../auth-user/repositories/auth.user.repository';
import { Sequelize } from 'sequelize-typescript';
import { EmailQueueService } from '../../queues/email/email.queue.service';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../../config/app/app.config.service';
import { RefreshTokenService } from '../refresh-token/refresh.token.service';
import { successResponse } from '../../common/dto/api-response/api.response.handler';
import { ResponseCode, UserPresenceStatusEnum } from '../../common/enums';
import { AuthUser } from '../auth-user/models/auth.user.model';
import { Transaction } from 'sequelize';
import { IUserRegResponse } from './interfaces/user-reg-response.interface';
import { UserService } from '../customer/services';
import { AuthUserService } from '../auth-user/auth.user.service';
import { OtpParamDto } from './dto/otp.param.dto';
import { CreatePasswordResetDto } from './dto/create.password.reset.dto';
import { JwtPayload, jwtToken } from './interfaces/jwt-payload.interface';
import { LoginResponseDto } from './dto/login.response.dto';
import { CreateRefreshTokenDto } from './dto/create.refresh.token.dto';
import { CredentialsDto } from './dto/credentials.dto';
import { CreateUserDto } from './dto/user/create-user.dto';
import { UserTypes } from '../../common/enums/user.types';
import { EmailOptionsDto } from '../../core/email/dto/email.options.dto';
import { RequestPasswordDto } from './dto/request.password.dto';
import ms, { StringValue } from 'ms';

@Injectable()
export class AuthService {
  private expiresIn: number;

  constructor(
    private readonly logger: AppLogger,
    private readonly authUserRepo: AuthUserRepository,
    private readonly util: Util,
    private readonly sequelize: Sequelize,
    private readonly emailQueueService: EmailQueueService,
    private readonly hashUtil: HashUtil,
    private readonly jwtService: JwtService,
    private readonly appConfig: AppConfigService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly userService: UserService,
    private readonly authUserService: AuthUserService,
    private readonly dateUtil: DateUtil,
    private readonly phoneUtil: PhoneUtil,
  ) {
    this.logger = logger.withContext(AuthService.name);

    const expiresInConfig = this.appConfig.jwtRefreshExpTime as StringValue;
    this.expiresIn = Math.floor(ms(expiresInConfig) / 1000);
  }

  async handleOTPMessaging(
    authUser: AuthUser,
    generateUUID: boolean = true,
    transaction?: Transaction,
  ): Promise<void> {
    try {
      this.logger.log('Generating OTP for...', authUser);
      const otps: any[] = await this.authUserRepo.getReferences('otp');
      const otp: string = this.util.generateOTP(otps, 6);
      const uuids: string[] = await this.authUserRepo.getReferences('uuid');
      const uuid = this.util.generateUniqueUuid(uuids);
      this.logger.log(`Sending OTP: ${otp} to: ${authUser.emailAddress}...`);

      // update the OTP
      const otpExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
      const payload = {
        otp,
        otpExpiresAt,
        uuid: generateUUID ? uuid : authUser.uuid,
      };

      this.logger.log(
        `Updating user's account with: ${JSON.stringify(payload)}`,
      );

      const updatedUser = await this.authUserRepo.update(
        authUser.id as number,
        payload,
        transaction,
      );

      if (updatedUser) {
        this.logger.log(`OTP updated for`, updatedUser);
        const emailDto: EmailOptionsDto = {
          to: authUser.emailAddress?.toLowerCase() as string,
          subject: 'Verify your account',
          templateName: 'otp-mail',
          context: { otp, recipientName: authUser.firstName },
        };
        void this.emailQueueService.dispatchEmailJob(emailDto);
        // this.smsQueueService.dispatchSMS({
        //   phoneNumber: `${authUser.phoneNumber}`,
        //   body: otp,
        // });
      }
    } catch (e) {
      this.logger.error(`An error occurred while sending OTP`);
      this.logger.error(e);
    }
  }

  async handleUserRegistration(
    dto: CreateUserDto,
    userType: UserTypes,
  ): Promise<any> {
    dto.emailAddress = this.util.convertToLowercase(dto.emailAddress);
    dto.phoneNumber = dto.phoneNumber
      ? this.phoneUtil.getPhoneNumberWithDialingCode(dto.phoneNumber)
      : '';

    this.logger.log(`Handling normal ${userType} registration...`, dto);

    // Check if Phone already exists and not tied to the incoming email address.
    const phoneAccount = await this.authUserRepo.findOneByCondition({
      phoneNumber: dto.phoneNumber,
    });

    if (phoneAccount && phoneAccount.emailAddress !== dto.emailAddress) {
      throw new BadRequestException('Phone number already taken');
    }

    let authUser = await this.authUserRepo.findOneByCondition({
      username: dto.emailAddress,
      userType,
    });

    if (authUser) {
      this.logger.log(`${userType} account found`, authUser);
      if (
        authUser.presenceStatus === UserPresenceStatusEnum.ACTIVE ||
        authUser.presenceStatus === UserPresenceStatusEnum.DEACTIVATED
      ) {
        throw new BadRequestException('Account already exists. Login instead');
      }

      if (authUser.presenceStatus === UserPresenceStatusEnum.VERIFY_ACCOUNT) {
        return await this.handleUnverifiedUserAccount(authUser);
      }

      throw new BadRequestException(
        'An account with this email already exists. Login instead',
      );
    }

    try {
      authUser = await this.registerUser(dto, userType);

      const res: IUserRegResponse = {
        uuid: String(authUser.uuid),
        presenceStatus: authUser.presenceStatus as UserPresenceStatusEnum,
        emailAddress: String(authUser.emailAddress),
      };

      return successResponse(
        ResponseCode.VERIFY_ACCOUNT,
        res,
        'An OTP has been sent to your email',
      );
    } catch (e) {
      this.logger.error(e);

      if (e instanceof HttpException) throw e;

      throw new InternalServerErrorException(
        'An error has occurred. Try again later',
      );
    }
  }

  async registerUser(
    dto: CreateUserDto,
    userType: UserTypes,
  ): Promise<AuthUser> {
    dto.emailAddress = this.util.convertToLowercase(dto.emailAddress);
    dto.firstName = this.util.capitalizeFirstLetters(dto.firstName);
    dto.lastName = this.util.capitalizeFirstLetters(dto.lastName);

    if (dto.password) {
      dto['passwordHash'] = await this.hashUtil.hashPassword(dto.password);
    }

    const transaction = await this.sequelize.transaction();
    try {
      // Create the auth profile
      const authUser = await this.authUserService.createUser(
        dto,
        userType,
        transaction,
      );

      // Create the User's profile based on the User account type
      switch (userType) {
        case UserTypes.USER:
          await this.userService.createProfile(authUser, transaction);
          break;
      }

      await transaction.commit();
      await this.handleOTPMessaging(authUser, false);

      return authUser;
    } catch (e) {
      this.logger.error('Error occurred while registering your account', e);
      await transaction.rollback();
      throw new InternalServerErrorException(
        'Error occurred while registering customer',
      );
    }
  }

  private async handleUnverifiedUserAccount(authUser: AuthUser): Promise<any> {
    await this.handleOTPMessaging(authUser);

    const updatedAuthUser = await this.authUserRepo.findOneById(+authUser.id);
    if (!updatedAuthUser) {
      throw new BadRequestException('Unable to proceed with your request');
    }

    const res: IUserRegResponse = {
      uuid: String(updatedAuthUser.uuid),
      presenceStatus: authUser.presenceStatus as UserPresenceStatusEnum,
      emailAddress: String(authUser.emailAddress),
    };

    return successResponse(
      ResponseCode.VERIFY_ACCOUNT,
      res,
      'An OTP has been sent to your email',
    );
  }

  async triggerOTP(dto: RequestPasswordDto): Promise<any> {
    dto.emailAddress = this.util.convertToLowercase(dto.emailAddress);
    let authUser = await this.authUserRepo.findOneByCondition({
      username: dto.emailAddress,
      userType: dto.userType,
    });

    if (!authUser) throw new NotFoundException('Email address not found');
    if (authUser.presenceStatus === UserPresenceStatusEnum.DEACTIVATED) {
      throw new ForbiddenException('Your account is currently suspended');
    }
    try {
      await this.handleOTPMessaging(authUser);
      authUser = await this.authUserRepo.findOneById(Number(authUser.id));

      const res: IUserRegResponse = {
        uuid: authUser?.uuid as string,
        presenceStatus: `${authUser?.presenceStatus}`,
        emailAddress: `${authUser?.emailAddress}`,
      };

      return successResponse(ResponseCode.OTP_SENT, res, 'OTP sent!');
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(
        'An error has occurred. Try again later',
      );
    }
  }

  async verifyOTP(param: OtpParamDto): Promise<any> {
    this.logger.log('Verifying OTP', param);
    let authUser = await this.authUserRepo.findOneByCondition({
      otp: param.otp,
      uuid: param.uuid,
    });

    if (!authUser) throw new NotFoundException('Invalid OTP');
    if (authUser.presenceStatus === UserPresenceStatusEnum.DEACTIVATED) {
      throw new ForbiddenException('Your account is currently suspended');
    }

    if (this.dateUtil.hasOtpExpired(authUser.otpExpiresAt)) {
      throw new BadRequestException('OTP already expired');
    }
    const status = authUser.presenceStatus;
    try {
      const uuid = this.util.generateUniqueUuid(
        await this.authUserRepo.getReferences('uuid'),
      );

      let updated = { otp: null, otpExpiresAt: null, uuid };
      if (status === UserPresenceStatusEnum.VERIFY_ACCOUNT) {
        updated = {
          ...updated,
          ...{
            presenceStatus: UserPresenceStatusEnum.ACTIVE,
            hasVerifiedOTP: true,
          },
        };
      }
      authUser = await this.authUserRepo.update(+authUser.id, updated);
      if (!authUser) {
        throw new BadRequestException('Unable to complete your request');
      }

      const res: IUserRegResponse = {
        uuid: authUser?.uuid as string,
        presenceStatus: `${authUser?.presenceStatus}`,
        emailAddress: `${authUser?.emailAddress}`,
      };

      return status === UserPresenceStatusEnum.VERIFY_ACCOUNT
        ? await this.processLoginResponse(authUser)
        : successResponse(
            ResponseCode.OTP_IS_VALID,
            res,
            'Verification is successful',
          );
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('An error occurred');
    }
  }

  async resetPassword(dto: CreatePasswordResetDto): Promise<any> {
    const authUser = await this.authUserRepo.findOneByCondition({
      uuid: `${dto.uuid}`,
    });

    if (!authUser) {
      throw new NotFoundException('Account not found');
    }

    if (!authUser.passwordHash) {
      throw new BadRequestException('Your profile is not complete yet');
    }

    if (authUser.presenceStatus === UserPresenceStatusEnum.DEACTIVATED) {
      throw new ForbiddenException('Your account is currently suspended');
    }

    try {
      const passwordHash = await this.hashUtil.hashPassword(dto.password);
      await this.authUserRepo.update(+authUser.id, {
        passwordHash,
        otp: null,
        otpExpiresAt: null,
      });

      return successResponse(
        ResponseCode.OK,
        null,
        'Password reset is successfully',
      );
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  private async processLoginResponse(
    authUser: AuthUser,
    message: string = 'Account creation is complete',
  ): Promise<any> {
    const { accessToken, refreshToken } =
      await this.generateAuthToken(authUser);

    const account = await this.authUserRepo.findAuthUserWithProfileByType(
      +authUser.id,
    );

    const data: LoginResponseDto<AuthUser> = {
      accessToken,
      refreshToken,
      account,
    };

    return successResponse(ResponseCode.OK, data, message);
  }

  private async generateAuthToken(user: AuthUser): Promise<jwtToken> {
    const authUser = await this.authUserRepo.findAuthUserWithProfileByType(
      +user.id,
    );

    const payload: JwtPayload = {
      sub: +user.id,
      username: user.username,
      role: authUser?.userType,
    };

    this.logger.log(`Auth Token generated for user ${user.username}`, payload);

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.appConfig.jwtSecret,
      expiresIn: this.expiresIn,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.appConfig.jwtSecret,
      expiresIn: this.expiresIn,
    });

    // Store refresh token in DB
    await this.refreshTokenService.saveRefreshToken(
      +user.id,
      refreshToken,
      this.appConfig.jwtRefreshExpTime,
    );

    return { accessToken, refreshToken };
  }

  async refreshToken(dto: CreateRefreshTokenDto): Promise<any> {
    this.logger.log('Creating a refresh token and access token...', dto);
    const jwtPayload: JwtPayload = this.jwtService.verify(dto.refreshToken, {
      secret: this.appConfig.jwtSecret,
    });

    this.logger.log({ refreshTokenPayload: jwtPayload });

    if (!jwtPayload) throw new BadRequestException('Invalid refresh token');

    const refreshTokenStatus = await this.refreshTokenService.refresh(
      jwtPayload.sub,
      dto.refreshToken,
    );

    if (!refreshTokenStatus) {
      throw new BadRequestException('Invalid refresh token');
    }

    const authUser = await this.authUserRepo.findAuthUserWithProfileByType(
      jwtPayload.sub,
    );

    if (!authUser) throw new NotFoundException('User not found');

    const data = await this.generateAuthToken(authUser);

    return successResponse(
      ResponseCode.OK,
      data,
      'Refresh token generated successfully',
    );
  }

  async handleLogin(dto: CredentialsDto): Promise<any> {
    let authUser = await this.authUserRepo.findOneByCondition({
      username: dto.username,
      userType: dto.userType,
    });

    if (!authUser) throw new BadRequestException('Invalid credentials');

    const isMatch = await this.hashUtil.comparePassword(
      String(dto.password),
      String(authUser.passwordHash),
    );

    if (!isMatch) {
      throw new BadRequestException('Invalid login credentials');
    }

    if (authUser.presenceStatus === UserPresenceStatusEnum.DEACTIVATED) {
      throw new UnauthorizedException('Account currently blocked');
    }

    if (authUser.presenceStatus === UserPresenceStatusEnum.VERIFY_ACCOUNT) {
      return await this.handleUnverifiedUserAccount(authUser);
    }
    try {
      const { accessToken, refreshToken } =
        await this.generateAuthToken(authUser);

      authUser = await this.authUserRepo.findAuthUserWithProfileByType(
        +authUser.id,
      );

      const data: LoginResponseDto<AuthUser> = {
        accessToken,
        refreshToken,
        account: authUser,
      };

      return successResponse(ResponseCode.LOGGED_IN, data, 'Login succeeded');
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(
        'An error has occurred. Try again later',
      );
    }
  }
}
