import { AuthService } from '../auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { SocialAuthDto } from '../dto/social-auth.dto';

@Controller('social-auth')
export class SocialAuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('register')
  // registerWithSocial(@Body() dto: SocialAuthDto): Promise<any> {
  //   // return this.authService.registerWithSocial(dto);
  // }
  //
  // @Post('login')
  // loginWithSocial(@Body() dto: SocialAuthDto): Promise<any> {
  //   // return this.authService.loginWithSocial(dto);
  // }
}
