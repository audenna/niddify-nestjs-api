import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AuthUserModule } from './auth-user/auth.user.module';
import { RefreshTokenModule } from './refresh-token/refresh.token.module';
import { CustomerModule } from './customer/customer.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [
    AdminModule,
    AuthUserModule,
    RefreshTokenModule,
    CustomerModule,
    AuthModule,
    CategoryModule,
    HomeModule,
  ],
  exports: [
    AdminModule,
    AuthUserModule,
    RefreshTokenModule,
    CustomerModule,
    AuthModule,
    CategoryModule,
    HomeModule,
  ],
})
export class FeatureModule {}
