import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisConfigModule } from '../../config/redis/redis.config.module';
import { RedisConfigService } from '../../config/redis/redis.config.service';
import { CacheCoreService } from './cache.core.service';
import Redis, { RedisOptions } from 'ioredis';
import * as process from 'node:process';
import * as redisStore from 'cache-manager-ioredis';
import { RedisPubSubService } from './redis.pubsub.service';

/**
 * Usage:
 *    const cacheKey = `wallet:balance:${userId}`;
 *
 *     // Check cache first
 *     const cached = await this.cacheService.get<number>(cacheKey);
 *     if (cached !== null) {
 *       return cached;
 *     }
 *
 *     // Simulate DB fetch
 *     const balance = await this.fetchFromDatabase(userId);
 *
 *     // Set cache with optional TTL (e.g., 300 seconds)
 *     await this.cacheService.set<number>(cacheKey, balance, 300);
 *
 *     return balance;
 */
@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [RedisConfigModule],
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        const redisOptions: RedisOptions = {
          host: config.host,
          port: config.port,
          ...(process.env.NODE_ENV !== 'local' && {
            username: config.user,
            password: config.password,
          }),
          maxRetriesPerRequest: null, // disables the hard retry limit crash
          retryStrategy(times) {
            // backoff
            return Math.min(times * 50, 2000);
          },
        };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const [store] = await Promise.all([redisStore.create(redisOptions)]);

        return {
          store,
          ttl: 60,
        };
      },
    }),
  ],
  providers: [
    CacheCoreService,
    RedisPubSubService,
    {
      provide: 'REDIS_CLIENT',
      inject: [RedisConfigService],
      useFactory: (config: RedisConfigService) => {
        const redisOptions: RedisOptions = {
          host: config.host,
          port: config.port,
          ...(process.env.NODE_ENV !== 'local' && {
            username: config.user,
            password: config.password,
          }),
          maxRetriesPerRequest: null, // disables the hard retry limit crash
          retryStrategy(times) {
            // backoff
            return Math.min(times * 50, 2000);
          },
        };

        const redis = new Redis(redisOptions);

        redis.on('connect', () => {
          console.log('✅ Redis is connected successfully', 'RedisClient');
        });

        redis.on('error', (err) => {
          console.error(`❌ Redis failed to connect : ${err}`, 'RedisClient');
        });

        return redis;
      },
    },
    {
      provide: 'REDIS_PUBLISHER',
      inject: [RedisConfigService],
      useFactory: (config: RedisConfigService) => {
        const redis = new Redis({
          host: config.host,
          port: config.port,
          ...(process.env.NODE_ENV !== 'local' && {
            username: config.user,
            password: config.password,
          }),
          maxRetriesPerRequest: null, // disables the hard retry limit crash
          retryStrategy(times) {
            // backoff
            return Math.min(times * 50, 2000);
          },
        });

        redis.on('connect', () => {
          console.log('✅ Redis publisher connected');
        });

        redis.on('error', (err) => {
          console.error(`❌ Redis publisher error: ${err}`);
        });

        return redis;
      },
    },
    {
      provide: 'REDIS_SUBSCRIBER',
      inject: [RedisConfigService],
      useFactory: (config: RedisConfigService) => {
        const redis = new Redis({
          host: config.host,
          port: config.port,
          ...(process.env.NODE_ENV !== 'local' && {
            username: config.user,
            password: config.password,
          }),
          maxRetriesPerRequest: null, // disables the hard retry limit crash
          retryStrategy(times) {
            // backoff
            return Math.min(times * 50, 2000);
          },
        });

        redis.on('connect', () => {
          console.log('✅ Redis subscriber connected');
        });

        redis.on('error', (err) => {
          console.error(`❌ Redis subscriber error: ${err}`);
        });

        return redis;
      },
    },
  ],
  exports: [
    CacheModule,
    CacheCoreService,
    RedisPubSubService,
    'REDIS_CLIENT',
    'REDIS_PUBLISHER',
    'REDIS_SUBSCRIBER',
  ],
})
export class CacheCoreModule {}
