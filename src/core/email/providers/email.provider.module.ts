import { Module } from '@nestjs/common';
import { EmailConfigModule } from '../config/email-config.module';

@Module({
  imports: [EmailConfigModule],
  providers: [],
  exports: [],
})
export class EmailProviderModule {}
