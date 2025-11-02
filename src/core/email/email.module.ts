import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { EmailProviderRegistry } from './providers/registry/email.provider.registry';
import { EmailService } from './email.service';
import { EmailProviderModule } from './providers/email.provider.module';

@Module({
  imports: [DiscoveryModule, EmailProviderModule],
  providers: [EmailProviderRegistry, EmailService],
  exports: [EmailService],
})
export class EmailModule {}
