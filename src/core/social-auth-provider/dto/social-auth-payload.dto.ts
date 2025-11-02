import { IsIn, IsNotEmpty, IsNotIn, IsString } from 'class-validator';
import { RegTypeEnum } from '../../../common/enums';
import { SocialAuthType } from '../enum/social-auth-type.enum';

export class SocialAuthPayloadDto {
  @IsNotIn([Object.values(RegTypeEnum.NORMAL_AUTH)])
  @IsIn(Object.values(RegTypeEnum), { message: 'Invalid provider' })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsIn(Object.values(SocialAuthType), { message: 'Invalid token type' })
  @IsString()
  @IsNotEmpty()
  tokenType: SocialAuthType;

  @IsString()
  @IsNotEmpty()
  code: string;
}
