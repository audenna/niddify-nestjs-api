import {
  isNameValid,
  IsValidDateFormat,
} from '../../../common/validators';
import { IsOptional, IsString } from 'class-validator';
import { IsPhoneNumberValidDecorator } from '../../../common/decorators/is-phone-number-valid.decorator';

export class UpdateProfileDto {
  @isNameValid()
  @IsOptional()
  firstName: string;

  @isNameValid()
  @IsOptional()
  lastName: string;

  @IsPhoneNumberValidDecorator({ message: 'Enter a valid phone number' })
  @IsOptional({ message: 'Phone number should not be empty' })
  phoneNumber: string;

  @IsValidDateFormat({ message: 'dateOfBirth must be valid DD/MM/YYYY date' })
  @IsString()
  @IsOptional()
  dateOfBirth: string;
}
