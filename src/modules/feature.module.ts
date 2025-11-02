import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AuthUserModule } from './auth-user/auth.user.module';
import { RefreshTokenModule } from './refresh-token/refresh.token.module';
import { CustomerModule } from './customer/customer.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AdminModule,
    AuthUserModule,
    RefreshTokenModule,
    CustomerModule,
    AuthModule,
  ],
  exports: [
    AdminModule,
    AuthUserModule,
    RefreshTokenModule,
    CustomerModule,
    AuthModule,
  ],
})
export class FeatureModule {}
