import { isNameValid, IsValidNumber } from '../../../common/validators';
import { IsOptional } from 'class-validator';
import { IsPhoneNumberValidDecorator } from '../../../common/decorators/is-phone-number-valid.decorator';

export class UpdateAdminProfileDto {
  @isNameValid()
  @IsOptional()
  firstName: string;

  @isNameValid()
  @IsOptional()
  lastName: string;

  @IsPhoneNumberValidDecorator({ message: 'Enter a valid phone number' })
  @IsOptional({ message: 'Phone number should not be empty' })
  phoneNumber: string;

  @IsValidNumber()
  @IsOptional()
  stateId: number;
}
