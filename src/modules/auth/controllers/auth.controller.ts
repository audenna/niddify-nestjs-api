import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { OtpParamDto } from '../dto/otp.param.dto';
import { CreatePasswordResetDto } from '../dto/create.password.reset.dto';
import { CreateRefreshTokenDto } from '../dto/create.refresh.token.dto';
import { CredentialsDto } from '../dto/credentials.dto';
import { RequestPasswordDto } from '../dto/request.password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('otp/trigger')
  async triggerOTP(@Body() dto: RequestPasswordDto): Promise<any> {
    return await this.authService.triggerOTP(dto);
  }

  @Post('otp/verify')
  async verifyOTP(@Body() param: OtpParamDto): Promise<any> {
    return await this.authService.verifyOTP(param);
  }

  @Post('account/resetPassword')
  resetPassword(@Body() dto: CreatePasswordResetDto): Promise<any> {
    return this.authService.resetPassword(dto);
  }

  @Post('login')
  login(@Body() dto: CredentialsDto): Promise<any> {
    return this.authService.handleLogin(dto);
  }

  @Post('refreshToken')
  async handleRefreshToken(@Body() dto: CreateRefreshTokenDto): Promise<any> {
    return await this.authService.refreshToken(dto);
  }
}
