import { Body, Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  UserTypesAllowed,
  UserTypesGuard,
} from '../../common/guards/user-types.guard';
import { UserTypes } from '../../common/enums/user.types';
import { AdminService } from './admin.service';

@UseGuards(JwtAuthGuard, UserTypesGuard)
@UserTypesAllowed(UserTypes.NIDDIFY_ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}
}
