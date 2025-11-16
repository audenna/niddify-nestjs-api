import { AuthUserService } from './auth.user.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserTypesGuard } from '../../common/guards/user-types.guard';
import { AuthUser } from './models/auth.user.model';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, UserTypesGuard)
@Controller('profile')
export class AuthUserController {
  constructor(private readonly service: AuthUserService) {}

  @Get()
  async getProfile(@CurrentUser() user: AuthUser): Promise<any> {
    return await this.service.getLoggedInProfile(user);
  }
}
