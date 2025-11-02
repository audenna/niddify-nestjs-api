import { Global, Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { EmailModule } from './email/email.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { CacheCoreModule } from './cache/cache.core.module';
import { SocialAuthModule } from './social-auth-provider/social-auth.module';

@Global()
@Module({
  imports: [
    LoggerModule,
    EmailModule,
    FileUploadModule,
    CacheCoreModule,
    SocialAuthModule,
  ],
  exports: [
    LoggerModule,
    EmailModule,
    FileUploadModule,
    CacheCoreModule,
    SocialAuthModule,
  ],
})
export class CoreModule {}
