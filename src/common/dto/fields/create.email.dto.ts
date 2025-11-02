import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateEmailDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  emailAddress: string;
}
