import Joi from 'joi';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigService } from './app.config.service';
import appConfiguration from './app.configuration';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfiguration],
      validationSchema: Joi.object({
        APP_NAME: Joi.string().required(),
        PORT: Joi.number().required().default(7000),
        NODE_ENV: Joi.string().required(),
        HOST: Joi.string().required(),
        SALT_OR_ROUNDS: Joi.number().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXP_TIME: Joi.string().required().default('30d'),
        JWT_REFRESH_EXP: Joi.string().required().default('60d'),
        SUPER_ADMIN_EMAIL_ADDRESS: Joi.string().required(),
        SUPER_ADMIN_FIRST_NAME: Joi.string().required(),
        SUPER_ADMIN_LAST_NAME: Joi.string().required(),
        SUPER_ADMIN_PASSWORD: Joi.string().required(),
      }),
    }),
  ],
  providers: [AppConfigService, ConfigService],
  exports: [AppConfigService, ConfigService],
})
export class AppConfigModule {}
