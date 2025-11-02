import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailQueueService } from './email.queue.service';
import { EmailQueueProcessor } from './email.queue.processor';

@Global()
@Module({
  imports: [BullModule.registerQueue({ name: 'email-queue' })],
  providers: [EmailQueueService, EmailQueueProcessor],
  exports: [EmailQueueService],
})
export class EmailQueueModule {}
