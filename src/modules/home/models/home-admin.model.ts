import {
  BeforeDestroy,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Index,
  Table,
} from 'sequelize-typescript';
import { UuidModel } from '../../../common/models/models';
import { IHomeAdmin } from '../interfaces/home.interface';
import { Home } from './home.model';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { AuthUser } from '../../auth-user/models/auth.user.model';

@Table({ tableName: 'home_admins' })
export class HomeAdmin
  extends UuidModel<
    InferAttributes<HomeAdmin>,
    InferCreationAttributes<HomeAdmin>
  >
  implements IHomeAdmin
{
  @ForeignKey(() => Home)
  @Index
  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null })
  declare homeId: number;

  @BelongsTo(() => Home, { foreignKey: 'homeId', onDelete: 'CASCADE' })
  declare home?: Home;

  @ForeignKey(() => AuthUser)
  @Index
  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null })
  declare authUserId: number;

  @BelongsTo(() => AuthUser, { foreignKey: 'authUserId', onDelete: 'CASCADE' })
  declare authUser?: AuthUser;

  @Index
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare isCreator: boolean;

  @BeforeDestroy
  static async deleteAuthUser(instance: HomeAdmin) {
    if (!instance.authUserId) return;

    await AuthUser.destroy({
      where: { id: instance.authUserId },
      individualHooks: true,
    });
  }
}
