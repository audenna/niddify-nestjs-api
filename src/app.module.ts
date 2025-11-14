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
import { Sequelize } from 'sequelize-typescript';

// Sequelize Pool interface for runtime-safe usage
interface SequelizePool {
  size: number;
  available: number;
  pending: number;
}

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
  constructor(private readonly sequelize: Sequelize) {}

  onModuleInit() {
    // Access internal pool safely
    const connectionManager: any = this.sequelize.connectionManager;

    // Safely extract pool without triggering ESLint
    const managerWithPool = connectionManager as unknown as {
      pool?: SequelizePool;
    };

    const pool = managerWithPool.pool;
    if (!pool) {
      console.warn('⚠️ Sequelize pool not initialized yet.');
      return;
    }

    // Log pool metrics every 5 seconds
    setInterval(() => {
      const stats = {
        total: Number(pool.size) || 0,
        available: pool.available || 0,
        waiting: pool.pending || 0,
        inUse: (pool.size || 0) - (pool.available || 0),
      };

      const usage = `${stats.inUse}/${stats.total} connections in use`;
      console.log(
        `🧠 Sequelize Pool Stats → ${usage} | waiting: ${stats.waiting}`,
      );
    }, 5000);
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SanitizeMiddleware).forRoutes('*');
  }
}
