import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppLogger } from '../../core/logger/logger.service';

@Injectable()
export class CleanupJob {
  constructor(private readonly logger: AppLogger) {
    this.logger = logger.withContext(CleanupJob.name);
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  handleCleanup(): void {
    this.logger.log('CronJob is running...');
  }
}
