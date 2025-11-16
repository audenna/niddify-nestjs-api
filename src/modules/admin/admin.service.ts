import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AppLogger } from '../../core/logger/logger.service';
import { DateUtil, PhoneUtil, Util } from '../../common/utils';
import { AuthUserRepository } from '../auth-user/repositories/auth.user.repository';
import { Sequelize } from 'sequelize-typescript';
import { AdminRepository } from './repositories/admin.repository';

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
