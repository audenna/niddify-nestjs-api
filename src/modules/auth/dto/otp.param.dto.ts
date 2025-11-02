import { IsNotEmpty, IsString, IsUUID, Length, Matches } from 'class-validator';

export class OtpParamDto {
  @Matches(/^\d+$/, { message: 'OTP must be numeric' })
  @Length(6, 6) // or whatever your OTP length is
  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsUUID()
  @IsNotEmpty()
  uuid: string;
}
