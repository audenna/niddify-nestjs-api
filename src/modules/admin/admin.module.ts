import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminRepository } from './repositories/admin.repository';
import { Admin } from './models/admin.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthUserModule } from '../auth-user/auth.user.module';

@Module({
  imports: [SequelizeModule.forFeature([Admin]), AuthUserModule],
  providers: [AdminService, AdminRepository],
  exports: [AdminService, AdminRepository],
  controllers: [AdminController],
})
export class AdminModule {}
