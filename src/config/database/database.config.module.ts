import Joi from 'joi';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfigService } from './database.config.service';
import dbConfiguration from './database.configuration';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [dbConfiguration],
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
        FORWARD_DB_PORT: Joi.number().required().default(4508),
      }),
    }),
  ],
  providers: [DatabaseConfigService, ConfigService],
  exports: [DatabaseConfigService, ConfigService],
})
export class DatabaseConfigModule {}
