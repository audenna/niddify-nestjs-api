import { IsNotEmpty } from 'class-validator';
import { IsPhoneNumberValidDecorator } from '../../decorators/is-phone-number-valid.decorator';

export class CreatePhoneDto {
  @IsPhoneNumberValidDecorator({
    message: 'Phone number must be a valid 11 digits number',
  })
  @IsNotEmpty()
  phoneNumber: string;
}
