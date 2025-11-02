import { Global, Module } from '@nestjs/common';
import { AuthUserModule } from '../auth-user/auth.user.module';
import { AuthService } from './auth.service';
import { RefreshTokenModule } from '../refresh-token/refresh.token.module';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from '../../config/app/app.config.service';
import { PassportModule } from '@nestjs/passport';
import { CustomerModule } from '../customer/customer.module';
import {
  UserAuthController,
  AuthController,
  SocialAuthController,
} from './controllers';
import { JwtStrategy } from './jwt.strategy';

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config: AppConfigService) => ({
        secret: config.jwtSecret,
        signOptions: {
          expiresIn: config.jwtExpTime as unknown as number,
        },
      }),
      inject: [AppConfigService],
    }),
    AuthUserModule,
    CustomerModule,
    RefreshTokenModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController, UserAuthController, SocialAuthController],
})
export class AuthModule {}
