import {
  Injectable,
  Inject,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { Redis as RedisClient } from 'ioredis';
import { AppLogger } from '../logger/logger.service';

type CallbackFn = (message: any) => void;

/**
 * Usage:
 * @Injectable()
 * export class FeatureService implements OnModuleInit {
 *   constructor(private readonly redisPubSubService: RedisPubSubService) {}
 *
 *   async onModuleInit() {
 *     await this.redisPubSubService.subscribe('property:feature:added', async (payload) => {
 *       const { estatePropertyId } = payload;
 *       await this.recalculateTotalCost(estatePropertyId);
 *     });
 *   }
 *
 *   async addFeatureAndNotify(data: any) {
 *     // save feature...
 *     await this.redisPubSubService.publish('property:feature:added', {
 *       estatePropertyId: data.estatePropertyId,
 *     });
 *   }
 * }
 */
@Injectable()
export class RedisPubSubService implements OnModuleInit, OnModuleDestroy {
  private readonly listeners = new Map<string, CallbackFn[]>();

  constructor(
    @Inject('REDIS_PUBLISHER') private readonly publisher: RedisClient,
    @Inject('REDIS_SUBSCRIBER') private readonly subscriber: RedisClient,
    private readonly logger: AppLogger,
  ) {
    this.logger = logger.withContext(RedisPubSubService.name);
  }

  async onModuleInit(): Promise<void> {
    this.subscriber.on('message', (channel: string, message: any): void => {
      const callbacks = this.listeners.get(channel);
      if (callbacks?.length) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument
        const parsed = JSON.parse(message);
        callbacks.forEach((cb) => cb(parsed));
      }
    });

    // Subscribe to any registered channels
    for (const channel of this.listeners.keys()) {
      await this.subscriber.subscribe(channel);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await Promise.all([this.publisher.quit(), this.subscriber.quit()]);
  }

  publish(
    channel: string,
    payload: Record<string, any>,
    delayMs: number | null = 1000,
  ): void {
    const message = JSON.stringify(payload);
    this.logger.log(`📢 [RedisPubSub] Publishing to ${channel}`, payload);

    if (delayMs) {
      setTimeout(() => {
        void this.publisher.publish(channel, message);
      }, delayMs);
    } else void this.publisher.publish(channel, message);
  }

  async subscribe(
    channels: string | string[],
    callback: CallbackFn,
  ): Promise<void> {
    const channelList = Array.isArray(channels) ? channels : [channels];

    for (const channel of channelList) {
      if (!this.listeners.has(channel)) {
        this.listeners.set(channel, []);
        await this.subscriber.subscribe(channel);
      }

      const callbacks = this.listeners.get(channel);
      if (callbacks) {
        callbacks.push(callback);
      }
    }
  }
}
