import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QueueConfig } from '../queue.config';
import { ISmsQueuePayload } from './interfaces/sms.queue.payload.interface';
import { AppLogger } from '../../core/logger/logger.service';

/**
 * Usage:
 * constructor(
 *   private readonly smsQueueService: SmsQueueService,
 *   // ...
 * ) {}
 * await this.smsQueueService.dispatchSMS();
 */
@Injectable()
export class SmsQueueService {
  constructor(
    @InjectQueue('sms-queue') private readonly emailQueue: Queue,
    private readonly logger: AppLogger,
  ) {
    this.logger = logger.withContext(SmsQueueService.name);
  }

  async dispatchSMS(payload: ISmsQueuePayload): Promise<void> {
    this.logger.log(`Dispatching SMS through Queue...`);
    await this.emailQueue.add('send-sms', payload, QueueConfig);
  }
}
