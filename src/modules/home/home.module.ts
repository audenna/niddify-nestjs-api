import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  Home,
  HomeCoverPhoto,
  HomeType,
  HomeAdmin,
  HomeContact,
} from './models';
import {
  HomeAdminRepository,
  HomeContactRepository,
  HomeCoverPhotoRepository,
  HomeRepository,
  HomeTypeRepository,
} from './repositories';
import { HomeController, HomeTypeController } from './controllers';
import { HomeTypeService } from './services';
import { HomeService } from './services/home.service';
import { AuthUserModule } from '../auth-user/auth.user.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      HomeType,
      Home,
      HomeCoverPhoto,
      HomeAdmin,
      HomeContact,
    ]),
    AuthUserModule,
  ],
  providers: [
    HomeTypeRepository,
    HomeTypeService,
    HomeRepository,
    HomeService,
    HomeCoverPhotoRepository,
    HomeAdminRepository,
    HomeContactRepository,
  ],
  exports: [
    HomeTypeRepository,
    HomeTypeService,
    HomeRepository,
    HomeService,
    HomeCoverPhotoRepository,
    HomeAdminRepository,
    HomeContactRepository,
  ],
  controllers: [HomeTypeController, HomeController],
})
export class HomeModule {}
