import { BaseRepository } from '../../../common/repositories/base.repository';
import { RefreshToken } from '../models/refresh.token.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class RefreshTokenRepository extends BaseRepository<RefreshToken> {
  constructor(@InjectModel(RefreshToken) model: typeof RefreshToken) {
    super(model);
  }
}
