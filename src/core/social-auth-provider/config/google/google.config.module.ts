import Joi from 'joi';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleConfigService } from './google.config.service';
import appConfiguration from './google.configuration';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfiguration],
      validationSchema: Joi.object({
        // GOOGLE_API: Joi.string().required(),
      }),
    }),
  ],
  providers: [GoogleConfigService, ConfigService],
  exports: [GoogleConfigService, ConfigService],
})
export class GoogleConfigModule {}
