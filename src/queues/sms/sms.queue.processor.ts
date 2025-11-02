import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { AppLogger } from '../../core/logger/logger.service';
import { ISmsQueuePayload } from './interfaces/sms.queue.payload.interface';

@Processor('email-queue')
export class SmsQueueProcessor {
  constructor(private readonly logger: AppLogger) {
    this.logger = logger.withContext(SmsQueueProcessor.name);
  }

  @Process('send-sms')
  async handleSendSMS(job: Job) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { phoneNumber, body }: ISmsQueuePayload = job.data;

    this.logger.log(`Sending sms to ${phoneNumber} with message "${body}"`);
    // Implement actual sms logic here
    // await this.smsService.send(phoneNumber, body);
  }
}
