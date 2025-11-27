import { BaseRepository } from '../../../common/repositories/base.repository';
import { HomeCoverPhoto } from '../models';
import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HomeCoverPhotoRepository extends BaseRepository<HomeCoverPhoto> {
  constructor(@InjectModel(HomeCoverPhoto) model: typeof HomeCoverPhoto) {
    super(model);
  }
}
