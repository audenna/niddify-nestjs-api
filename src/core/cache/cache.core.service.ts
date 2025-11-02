import { Inject, Injectable } from '@nestjs/common';
import { Redis as RedisClient } from 'ioredis';
import { AppLogger } from '../logger/logger.service';

@Injectable()
export class CacheCoreService {
  constructor(
    @Inject('REDIS_CLIENT') public readonly redis: RedisClient,
    private readonly logger: AppLogger,
  ) {
    this.logger = logger.withContext(CacheCoreService.name);
  }

  /**
   * This is an example of how it's stored:
   *
   * Key: staking:round:12345
   *
   * Field: player:42
   * Value: {
   *   stakeId: "abc-uuid",
   *   amount: 500,
   *   timestamp: 1719343992
   * }
   * Key: staking:round:1234
   * {
   *   'player:1': '{"stakeAmount": 500, "timestamp": 1719343992}',
   *   'player:2': '{"stakeAmount": 1000, "timestamp": 1719343995}'
   * }
   * This is best for faster lookup
   * @param key
   * @param field
   * @param data
   */
  async saveHsetRedisObject<T>(
    key: string,
    field: string,
    data: T,
  ): Promise<void> {
    this.logger.log('Saving Redis Hset object...');
    this.logger.log({ key, field, data });
    await this.redis.hset(key, field, JSON.stringify(data));
  }

  async hasHsetRedisObject(key: string, field: string): Promise<boolean> {
    return (await this.redis.hexists(key, field)) > 0;
  }

  async getHsetRedisObject<T>(key: string, field: string): Promise<T | null> {
    const data = await this.redis.hget(key, field);
    return data ? JSON.parse(data) : null;
  }

  async deleteHsetRedisObject(key: string, field: string): Promise<void> {
    await this.redis.hdel(key, field);
  }

  async getHgetll(key: string): Promise<any> {
    const result = await this.redis.hgetall(key);

    if (result) {
      // Deserialize values
      return Object.fromEntries(
        Object.entries(result).map(([field, data]) => [
          field,
          JSON.parse(data),
        ]),
      );
    }
    return null;
  }

  async saveToRedis(
    key: string,
    value: any,
    ttl: number | null = 86400, // default to 24 hours
  ): Promise<void> {
    this.logger.log(`Adding to redis: ${JSON.stringify(value)}`);
    const data = JSON.stringify(value);
    if (ttl) {
      await this.redis.set(key, data, 'EX', ttl);
    } else await this.redis.set(key, data);
  }

  async getFromRedis<T>(key: string): Promise<T | null> {
    this.logger.log(`Retrieving from redis key: ${key}`);
    try {
      const data = await this.redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Failed to parse Redis value for key: ${key}`, error);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async has(key: string): Promise<boolean> {
    const value = await this.getFromRedis(key);
    return value !== null;
  }

  async tryLock(key: string, ttlSeconds: number): Promise<boolean> {
    const result = await this.redis.set(key, 'locked', 'EX', ttlSeconds, 'NX');
    return result === 'OK';
  }
}
