import { BaseRepository } from '../../../common/repositories/base.repository';
import { Home, HomeContact, HomeCoverPhoto, HomeType } from '../models';
import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HomeRepository extends BaseRepository<Home> {
  constructor(@InjectModel(Home) model: typeof Home) {
    super(model);
  }

  getRelationships(): object[] {
    return [
      { model: HomeType, as: 'type' },
      { model: HomeCoverPhoto },
      { model: HomeContact },
    ];
  }
}
