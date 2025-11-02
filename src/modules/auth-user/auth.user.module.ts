import { Module } from '@nestjs/common';
import { AuthUserRepository } from './repositories/auth.user.repository';
import { AuthUserService } from './auth.user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthUser } from './models/auth.user.model';

@Module({
  imports: [SequelizeModule.forFeature([AuthUser])],
  providers: [AuthUserRepository, AuthUserService],
  exports: [AuthUserService, AuthUserRepository],
})
export class AuthUserModule {}
