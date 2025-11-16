import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './models/category.model';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [SequelizeModule.forFeature([Category])],
  providers: [CategoryRepository, CategoryService],
  exports: [CategoryRepository, CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
