import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { DatabaseConfigService } from '../config/database/database.config.service';
import { AppConfigService } from '../config/app/app.config.service';

// Import all Models here
import * as Models from '../modules/index.models';

export const getSequelizeConfig = (
  databaseConfigService: DatabaseConfigService,
  appConfigService: AppConfigService,
): SequelizeModuleOptions => {
  console.log(
    `Using sequelize config: ${JSON.stringify(appConfigService, null, 2)}`,
  );
  console.log(
    `MySQL database connection started using ${appConfigService.env} configuration`,
  );
  return {
    dialect: 'mysql',
    host: databaseConfigService.host,
    port: databaseConfigService.port,
    username: databaseConfigService.user,
    password: databaseConfigService.password,
    database: databaseConfigService.name,
    autoLoadModels: true,
    synchronize: true,
    logging: false,
    models: Object.values(Models),
  };
};
