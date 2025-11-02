import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRefreshTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'No refresh token was supplied ' })
  refreshToken: string;
}
