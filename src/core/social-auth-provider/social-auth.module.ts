import { Module } from '@nestjs/common';
import { SocialAuthService } from './social-auth.service';
import { GoogleAuthService } from './providers';
import { DiscoveryModule } from '@nestjs/core';
import { SocialAuthRegistry } from './social-auth.registry';
import { HttpModule } from '@nestjs/axios';
import { GoogleConfigModule } from './config/google/google.config.module';

@Module({
  imports: [DiscoveryModule, HttpModule, GoogleConfigModule],
  providers: [GoogleAuthService, SocialAuthService, SocialAuthRegistry],
  exports: [SocialAuthService],
})
export class SocialAuthModule {}
