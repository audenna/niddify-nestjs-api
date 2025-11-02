import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { Admin } from '../models/admin.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AdminRepository extends BaseRepository<Admin> {
  constructor(@InjectModel(Admin) model: typeof Admin) {
    super(model);
  }
}
