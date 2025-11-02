import { Module } from '@nestjs/common';
import { SmsQueueProcessor } from './sms.queue.processor';
import { BullModule } from '@nestjs/bull';
import { SmsQueueService } from './sms.queue.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'sms-queue' })],
  providers: [SmsQueueProcessor, SmsQueueService],
  exports: [SmsQueueService],
})
export class SmsQueueModule {}
