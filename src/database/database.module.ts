import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfigService } from '../config/database/database.config.service';
import { getSequelizeConfig } from './sequelize.config';
import { AppConfigService } from '../config/app/app.config.service';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [DatabaseConfigService, AppConfigService],
      useFactory: (
        databaseConfigService: DatabaseConfigService,
        appConfig: AppConfigService,
      ) => getSequelizeConfig(databaseConfigService, appConfig),
    }),
  ],
})
export class DatabaseModule {}
