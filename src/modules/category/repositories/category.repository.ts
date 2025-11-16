import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { Category } from '../models/category.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
  constructor(@InjectModel(Category) model: typeof Category) {
    super(model);
  }
}
