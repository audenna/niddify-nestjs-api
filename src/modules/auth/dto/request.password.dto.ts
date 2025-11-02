import { CreateEmailDto } from '../../../common/dto/fields/create.email.dto';
import { IntersectionType } from '@nestjs/mapped-types';
import { UserTypeValidateDto } from './user.type.validate.dto';

export class RequestPasswordDto extends IntersectionType(
  CreateEmailDto,
  UserTypeValidateDto,
) {}
