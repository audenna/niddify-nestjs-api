import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  UserTypeAllowed,
  UserTypesGuard,
} from '../../common/guards/user-types.guard';
import { UserTypes } from '../../common/enums/user.types';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthUser } from '../auth-user/models/auth.user.model';
import { AdminService } from './admin.service';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';

@UseGuards(JwtAuthGuard, UserTypesGuard)
@UserTypeAllowed(UserTypes.NIDDIFY_ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  // @Get('profile')
  // getProfile(@CurrentUser() user: AuthUser): any {
  //   return this.service.getLoggedInProfile(user);
  // }
  //
  // @Patch('profile')
  // async updateProfile(
  //   @CurrentUser() user: AuthUser,
  //   @Body() payload: UpdateAdminProfileDto,
  // ): Promise<any> {
  //   return await this.service.updateProfile(user, payload);
  // }
}
