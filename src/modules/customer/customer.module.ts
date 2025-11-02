import { Module } from '@nestjs/common';
import { UserRepository } from './repositories';
import { UserService } from './services';
import { AdminCustomerController, UserController } from './controllers';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models';
import { AuthUserModule } from '../auth-user/auth.user.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), AuthUserModule],
  providers: [UserRepository, UserService],
  exports: [UserRepository, UserService],
  controllers: [UserController, AdminCustomerController],
})
export class CustomerModule {}
