import { IsNotEmpty, IsString } from 'class-validator';
import { CreatePasswordDto } from '../../../common/dto/fields/create.password.dto';
import { IntersectionType } from '@nestjs/mapped-types';
import { UserTypeValidateDto } from './user.type.validate.dto';

export class CredentialsDto extends IntersectionType(
  CreatePasswordDto,
  UserTypeValidateDto,
) {
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username should not be empty' })
  username: string;
}
