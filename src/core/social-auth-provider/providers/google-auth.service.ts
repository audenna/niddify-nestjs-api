import { ISocialAuth } from '../interfaces/social-auth.interface';
import { RegTypeEnum } from '../../../common/enums';
import { lastValueFrom, map } from 'rxjs';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { IGoogleAuthProfile } from '../interfaces/social-auth-profile.interface';
import { AppLogger } from '../../logger/logger.service';
import { HttpService } from '@nestjs/axios';
import { SocialAuthResponseDto } from '../dto/social-auth-response.dto';
import { SocialAuthType } from '../enum/social-auth-type.enum';
import { SocialAuthProvider } from '../decorators/social-auth.decorator';
import { GoogleConfigService } from '../config/google/google.config.service';
import { Util } from '../../../common/utils';

@SocialAuthProvider(RegTypeEnum.GOOGLE_AUTH)
@Injectable()
export class GoogleAuthService implements ISocialAuth {
  constructor(
    private readonly logger: AppLogger,
    private readonly httpService: HttpService,
    private readonly config: GoogleConfigService,
    private readonly util: Util,
  ) {
    this.logger = logger.withContext(GoogleAuthService.name);
  }

  getProviderName(): string {
    return RegTypeEnum.GOOGLE_AUTH;
  }

  /**
   *
   * @param accessToken
   * {
   *     "iss": "https://accounts.google.com",
   *     "azp": "221963291713-.apps..com",
   *     "aud": "221963291713-.apps..com",
   *     "sub": "",
   *     "email": "",
   *     "email_verified": "true",
   *     "nbf": "1700045966",
   *     "name": "Francis Udenna",
   *     "picture": "",
   *     "given_name": "Francis",
   *     "family_name": "Udenna",
   *     "locale": "en",
   *     "iat": "1700046266",
   *     "exp": "1700049866",
   *     "jti": "",
   *     "alg": "RS256",
   *     "kid": "",
   *     "typ": "JWT"
   * }
   */
  getProfileFromIdToken = async (
    accessToken: string,
  ): Promise<IGoogleAuthProfile> => {
    const api: string = `${this.config.googleApiUri}/oauth2/v3/tokeninfo?id_token=${accessToken} `;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await lastValueFrom(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access
        this.httpService.get(api).pipe(map((response: any) => response.data)),
      );
    } catch (e) {
      this.logger.error(e);
      throw new BadGatewayException('Validation failed. Try again later.');
    }
  };

  getProfileFromAccessToken = async (
    accessToken: string,
  ): Promise<IGoogleAuthProfile> => {
    const api: string = `${this.config.googleApiUri}/oauth2/v3/userinfo?access_token=${accessToken} `;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await lastValueFrom(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access
        this.httpService.get(api).pipe(map((response: any) => response.data)),
      );
    } catch (e) {
      this.logger.error(e);
      throw new BadGatewayException('Validation failed. Try again later.');
    }
  };

  async getUserAccount(
    tokenType: SocialAuthType,
    code: string,
  ): Promise<SocialAuthResponseDto> {
    this.logger.log(
      `Handling user social auth request through: ${this.getProviderName()}`,
    );

    const info: IGoogleAuthProfile =
      tokenType === SocialAuthType.ACCESS_TOKEN
        ? await this.getProfileFromAccessToken(code)
        : await this.getProfileFromIdToken(code);

    this.logger.log(
      `Information retrieved from: ${this.getProviderName()}`,
      info,
    );

    if (!info) throw new BadRequestException('Authentication failed');

    const data: SocialAuthResponseDto = {
      firstName: this.util.capitalizeFirstLetters(info.given_name),
      lastName: this.util.capitalizeFirstLetters(info.family_name ?? ''),
      emailAddress: this.util.convertToLowercase(info.email),
      picture: info.picture,
    };

    this.logger.log(`${this.getProviderName()} response:`, data);

    return data;
  }
}
