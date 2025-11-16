import { BaseRepository } from '../../../common/repositories/base.repository';
import { HomeType } from '../models';
import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HomeTypeRepository extends BaseRepository<HomeType> {
  constructor(@InjectModel(HomeType) model: typeof HomeType) {
    super(model);
  }
}
