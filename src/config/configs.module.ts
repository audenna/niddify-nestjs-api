import { Global, Module } from '@nestjs/common';
import { AppConfigModule } from './app/app.config.module';
import { DatabaseConfigModule } from './database/database.config.module';
import { FileUploadConfigModule } from './file-upload/file-upload.config.module';
import { RedisConfigModule } from './redis/redis.config.module';

@Global()
@Module({
  imports: [
    AppConfigModule,
    DatabaseConfigModule,
    FileUploadConfigModule,
    RedisConfigModule,
  ],
  exports: [
    AppConfigModule,
    DatabaseConfigModule,
    FileUploadConfigModule,
    RedisConfigModule,
  ],
})
export class ConfigsModule {}
