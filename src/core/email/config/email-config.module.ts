import { Module } from '@nestjs/common';
import { AwsEmailConfigModule } from './aws/aws-email.config.module';

@Module({
  imports: [AwsEmailConfigModule],
  exports: [AwsEmailConfigModule],
})
export class EmailConfigModule {}
