import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { DatabaseConfigService } from '../config/database/database.config.service';
import { AppConfigService } from '../config/app/app.config.service';

// Import all Models here
import * as Models from '../modules/index.models';

export const getSequelizeConfig = (
  databaseConfigService: DatabaseConfigService,
  appConfigService: AppConfigService,
): SequelizeModuleOptions => {
  const isProduction = appConfigService.env === 'production';

  console.log(
    `🔌 MySQL database connection started using ${appConfigService.env} configuration`,
  );

  return {
    dialect: 'mysql',
    host: databaseConfigService.host,
    port: databaseConfigService.port,
    username: databaseConfigService.user,
    password: databaseConfigService.password,
    database: databaseConfigService.name,
    autoLoadModels: true,
    synchronize: databaseConfigService.isSync,
    models: Object.values(Models),

    pool: {
      max: 40, // bump to 40 for high concurrency (game loops + cron)
      min: 5,
      acquire: 20000, // wait up to 20s to get a connection
      idle: 10000, // close idle connections after 10s
      evict: 15000, // clean up stale connections every 15s
    },

    dialectOptions: {
      connectTimeout: 10000, // MySQL connect timeout
      timezone: '+00:00', // Keep MySQL in UTC (convert to local in app if needed)
      charset: 'utf8mb4_unicode_ci', // Ensure full emoji and multilingual support
    },

    logging: !isProduction, // Only enable logging in non-prod
    retry: {
      max: 3, // Retry transient failures (e.g., brief MySQL overloads)
    },
  };
};
