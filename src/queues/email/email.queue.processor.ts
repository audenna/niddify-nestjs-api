import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { AppLogger } from '../../core/logger/logger.service';
import { EmailOptionsDto } from '../../core/email/dto/email.options.dto';
import { EmailService } from '../../core/email/email.service';

@Processor('email-queue')
export class EmailQueueProcessor {
  constructor(
    private readonly logger: AppLogger,
    private readonly emailService: EmailService,
  ) {
    console.log('✅ EmailQueueProcessor instantiated!');
    this.logger = logger.withContext(EmailQueueProcessor.name);
  }

  @Process('send-email')
  async handleSendEmail(job: Job<EmailOptionsDto>): Promise<any> {
    const emailOptionsDto: EmailOptionsDto = job.data;

    this.logger.log(
      `Sending email to ${emailOptionsDto.to} with subject "${emailOptionsDto.subject}"`,
    );

    // Implement actual email logic here
    await this.emailService.handleEmailDispatch(emailOptionsDto);
  }
}
