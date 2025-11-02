import { isNameValid } from '../../../../common/validators';
import { IsNotEmpty } from 'class-validator';
import { CreatePasswordDto } from '../../../../common/dto/fields/create.password.dto';
import { CreateEmailDto } from '../../../../common/dto/fields/create.email.dto';
import { IntersectionType } from '@nestjs/mapped-types';
import { CreatePhoneDto } from '../../../../common/dto/fields/create-phone.dto';

export class CreateUserDto extends IntersectionType(
  CreatePasswordDto,
  CreateEmailDto,
  CreatePhoneDto,
) {
  @isNameValid({ message: 'First name must be valid name only.' })
  @IsNotEmpty({ message: 'Firs name is required.' })
  firstName: string;

  @isNameValid({ message: 'Last name must be valid name only.' })
  @IsNotEmpty({ message: 'Last name is required.' })
  lastName: string;
}
