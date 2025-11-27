import { BaseRepository } from '../../../common/repositories/base.repository';
import { HomeContact } from '../models';
import { InjectModel } from '@nestjs/sequelize';

export class HomeContactRepository extends BaseRepository<HomeContact> {
  constructor(@InjectModel(HomeContact) model: typeof HomeContact) {
    super(model);
  }
}
