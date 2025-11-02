import { SocialAuthPayloadDto } from '../../../core/social-auth-provider/dto/social-auth-payload.dto';
import { UserTypeValidateDto } from './user.type.validate.dto';
import { IntersectionType } from '@nestjs/mapped-types';

export class SocialAuthDto extends IntersectionType(
  SocialAuthPayloadDto,
  UserTypeValidateDto,
) {}
