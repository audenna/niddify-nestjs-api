import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { EmailQueueModule } from './email/email.queue.module';
import { SmsQueueModule } from './sms/sms.queue.module';

@Global()
@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get<string>('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    EmailQueueModule,
    SmsQueueModule,
  ],
  exports: [EmailQueueModule, SmsQueueModule],
})
export class QueueModule {}
