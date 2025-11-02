import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Index,
  Table,
} from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { AuthUser } from '../../auth-user/models/auth.user.model';
import { IAdmin } from '../interfaces/admin.interface';
import { UuidModel } from '../../../common/models/models';

@Table({ tableName: 'admins' })
export class Admin
  extends UuidModel<InferAttributes<Admin>, InferCreationAttributes<Admin>>
  implements IAdmin
{
  @ForeignKey(() => AuthUser)
  @Index
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare authUserId: number;

  @BelongsTo(() => AuthUser, { foreignKey: 'authUserId' })
  declare authUser?: AuthUser;
}
