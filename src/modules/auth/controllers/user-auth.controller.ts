import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { UserTypes } from '../../../common/enums/user.types';

@Controller('auth/user')
export class UserAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: CreateUserDto): Promise<any> {
    return this.authService.handleUserRegistration(dto, UserTypes.USER);
  }
}
