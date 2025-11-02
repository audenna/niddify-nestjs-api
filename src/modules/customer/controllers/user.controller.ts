import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  UserTypeAllowed,
  UserTypesGuard,
} from '../../../common/guards/user-types.guard';
import { UserTypes } from '../../../common/enums/user.types';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthUser } from '../../auth-user/models/auth.user.model';
import { UserService } from '../services';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { CreateAccountDeactivationDto } from '../dto/create-account-deactivation.dto';

@UseGuards(JwtAuthGuard, UserTypesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('profile')
  @UserTypeAllowed(UserTypes.USER)
  getProfile(@CurrentUser() user: AuthUser): any {
    // return this.service.getLoggedInProfile(user);
  }

  @Patch('profile')
  @UserTypeAllowed(UserTypes.USER)
  async updateProfile(
    @CurrentUser() user: AuthUser,
    @Body() payload: UpdateProfileDto,
  ): Promise<any> {
    // return await this.service.updateProfile(user, payload);
  }

  @Delete('profile')
  @UserTypeAllowed(UserTypes.USER)
  async deactivateOrDeleteAccount(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateAccountDeactivationDto,
  ): Promise<any> {
    // return await this.service.deactivateOrDeleteAccount(user, dto);
  }
}
