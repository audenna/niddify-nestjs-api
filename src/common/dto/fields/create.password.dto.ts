import { IsNotEmpty } from 'class-validator';
import { IsPassword } from '../../validators';

export class CreatePasswordDto {
  @IsPassword()
  @IsNotEmpty()
  password: string;
}
