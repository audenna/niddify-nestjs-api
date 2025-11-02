import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AuthUser } from '../auth-user/models/auth.user.model';
import { successResponse } from '../../common/dto/api-response/api.response.handler';
import { ResponseCode } from '../../common/enums';
import { AppLogger } from '../../core/logger/logger.service';
import { DateUtil, PhoneUtil, Util } from '../../common/utils';
import { AuthUserRepository } from '../auth-user/repositories/auth.user.repository';
import { Sequelize } from 'sequelize-typescript';
import { AdminRepository } from './repositories/admin.repository';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';
import { UserRepository } from '../customer/repositories';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepo: AdminRepository,
    private readonly logger: AppLogger,
    private readonly util: Util,
    private readonly phoneUtil: PhoneUtil,
    private readonly authUserRepository: AuthUserRepository,
    private readonly sequelize: Sequelize,
    private readonly dateUtil: DateUtil,
  ) {
    this.logger = logger.withContext(AdminService.name);
  }
}
