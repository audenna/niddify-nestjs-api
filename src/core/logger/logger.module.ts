import { Global, Module } from '@nestjs/common';
import { AppLogger } from './logger.service';
import { ConfigModule } from '@nestjs/config';
import config from './logger.configuration';
import * as Joi from 'joi';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      validationSchema: Joi.object({
        LOGGER_CONTEXT: Joi.string().required(),
      }),
    }),
    LoggerModule,
  ],
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggerModule {}
