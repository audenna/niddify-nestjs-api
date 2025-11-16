import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { AuthUser } from '../models/auth.user.model';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable } from 'sequelize';
import { User } from '../../customer/models';
import { UserTypes } from '../../../common/enums/user.types';
import { Admin } from '../../admin/models/admin.model';
import { AppLogger } from '../../../core/logger/logger.service';

@Injectable()
export class AuthUserRepository extends BaseRepository<AuthUser> {
  constructor(
    @InjectModel(AuthUser) authUserModel: typeof AuthUser,
    private readonly logger: AppLogger,
  ) {
    super(authUserModel);
  }

  getUserRelationships(userType: UserTypes): Includeable[] {
    const includes: Includeable[] = [];

    switch (userType) {
      case UserTypes.USER:
        includes.push({
          model: User,
          as: 'user',
        });
        break;

      default:
        includes.push({
          model: Admin,
          as: 'admin',
        });
        break;
    }

    return includes;
  }

  async findAuthUserWithProfileByType(
    authUserId: number,
  ): Promise<AuthUser | null> {
    try {
      const authUser = await this.model.findByPk(authUserId);
      if (!authUser) return null;

      const includes = this.getUserRelationships(authUser.userType);

      return await this.model.findOne({
        where: { id: authUser.id },
        attributes: {
          exclude: ['passwordHash', 'otp', 'otpExpiresAt', 'deletedAt'],
        },
        include: includes,
      });
    } catch (e) {
      this.logger.error('Unable to link auth user profile', e);
      return null;
    }
  }
}
