import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HomeType } from './models';
import { HomeTypeRepository } from './repositories';
import { HomeTypeController } from './controllers';
import { HomeTypeService } from './services';

@Module({
  imports: [SequelizeModule.forFeature([HomeType])],
  providers: [HomeTypeRepository, HomeTypeService],
  exports: [HomeTypeRepository, HomeTypeService],
  controllers: [HomeTypeController],
})
export class HomeModule {}
