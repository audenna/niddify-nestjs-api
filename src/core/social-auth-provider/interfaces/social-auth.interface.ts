import { SocialAuthResponseDto } from '../dto/social-auth-response.dto';
import { SocialAuthType } from '../enum/social-auth-type.enum';

export interface ISocialAuth {
  /*
  |--------------------------------------------------------------------------
  | This interface is used to handle Multiple Social Authentication platforms
  | like: Facebook, Google, Twitter, Instagram, Apple, etc
  |--------------------------------------------------------------------------
  */
  getProviderName(): string;

  getUserAccount(
    tokenType: SocialAuthType,
    code: string,
  ): Promise<SocialAuthResponseDto>;
}
