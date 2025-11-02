import Joi from 'joi';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisConfigService } from './redis.config.service';
import config from './redis.configuration';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      validationSchema: Joi.object({
        CACHE_NAMESPACE: Joi.string().default('app-cache'),
        CACHE_TTL: Joi.number().default(3600),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_EXPOSED_PORT: Joi.number().default(6380),
        // REDIS_USER_NAME: Joi.string().default('redisUsername'),
        // REDIS_PASSWORD: Joi.string().default('redisPassword'),
      }),
    }),
  ],
  providers: [RedisConfigService, ConfigService],
  exports: [RedisConfigService, ConfigService],
})
export class RedisConfigModule {}
