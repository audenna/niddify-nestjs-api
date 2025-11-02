import Joi from 'joi';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileUploadConfigService } from './file-upload.config.service';
import appConfiguration from './file-upload.configuration';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfiguration],
      validationSchema: Joi.object({
        CLOUDINARY_CLOUD_NAME: Joi.string().optional().default(null),
        CLOUDINARY_API_KEY: Joi.string().optional().default(null),
        CLOUDINARY_API_SECRET: Joi.string().optional().default(null),
      }),
    }),
  ],
  providers: [FileUploadConfigService, ConfigService],
  exports: [FileUploadConfigService, ConfigService],
})
export class FileUploadConfigModule {}
