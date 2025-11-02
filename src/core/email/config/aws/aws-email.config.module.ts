import Joi from 'joi';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AwsEmailConfigService } from './aws-email.config.service';
import appConfiguration from './aws-email.configuration';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfiguration],
      validationSchema: Joi.object({
        // AWS_REGION: Joi.string().required(),
        // EMAIL_SEND_FROM_EMAIL: Joi.string().required(),
        // EMAIL_SEND_FROM_NAME: Joi.string().required(),
        // SES_ACCESS_KEY_ID: Joi.string().required(),
        // SES_SECRET_KEY: Joi.string().required(),
      }),
    }),
  ],
  providers: [AwsEmailConfigService, ConfigService],
  exports: [AwsEmailConfigService, ConfigService],
})
export class AwsEmailConfigModule {}
