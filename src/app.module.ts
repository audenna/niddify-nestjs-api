import { preloadEnv } from './config/preload-env';
preloadEnv();

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { CronModule } from './cron/cron.module';
import { CoreModule } from './core/core.module';
import { ConfigsModule } from './config/configs.module';
import { QueueModule } from './queues/queue.module';
import { DatabaseModule } from './database/database.module';
import { FeatureModule } from './modules/feature.module';
import { SanitizeMiddleware } from './common/middleware/sanitize.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env', '.env.testing'],
    }),
    ConfigsModule,
    DatabaseModule,
    CoreModule,
    QueueModule,
    CronModule,
    CommonModule,
    FeatureModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SanitizeMiddleware).forRoutes('*');
  }
}
