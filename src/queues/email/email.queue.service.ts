import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QueueConfig } from '../queue.config';
import { AppLogger } from '../../core/logger/logger.service';
import { EmailOptionsDto } from '../../core/email/dto/email.options.dto';

/**
 * Usage:
 * constructor(
 *   private readonly emailQueueService: EmailQueueService,
 *   // ...
 * ) {}
 * await this.emailQueueService.dispatchEmailJob();
 */
@Injectable()
export class EmailQueueService {
  constructor(
    @InjectQueue('email-queue') private readonly emailQueue: Queue,
    private readonly logger: AppLogger,
  ) {
    this.logger = logger.withContext(EmailQueueService.name);
  }

  async dispatchEmailJob(emailOptionsDto: EmailOptionsDto): Promise<void> {
    this.logger.log(`Dispatching email through Queue...`);
    this.logger.log(emailOptionsDto);
    await this.emailQueue.add('send-email', emailOptionsDto, QueueConfig);
  }
}
