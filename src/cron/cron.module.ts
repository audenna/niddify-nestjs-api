import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CleanupJob } from './jobs';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CleanupJob],
})
export class CronModule {}
