import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { User } from '../models';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@InjectModel(User) model: typeof User) {
    super(model);
  }
}
