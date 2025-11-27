import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { HomeAdmin } from '../models';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class HomeAdminRepository extends BaseRepository<HomeAdmin> {
  constructor(@InjectModel(HomeAdmin) model: typeof HomeAdmin) {
    super(model);
  }
}
