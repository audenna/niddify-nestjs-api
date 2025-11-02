import { IUser } from '../interfaces/user.interface';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Index,
  Model,
  Table,
} from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { AuthUser } from '../../auth-user/models/auth.user.model';

@Table({ tableName: 'users' })
export class User
  extends Model<InferAttributes<User>, InferCreationAttributes<User>>
  implements IUser
{
  @ForeignKey(() => AuthUser)
  @Index
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare authUserId: number;

  @BelongsTo(() => AuthUser, { foreignKey: 'authUserId' })
  declare authUser?: AuthUser;

  @Index
  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  declare dateOfBirth?: string | null;

  @Index
  @Column({
    type: DataType.DECIMAL(10, 6),
    allowNull: false,
    defaultValue: '0.0',
  })
  declare latitude?: number | null;

  @Index
  @Column({
    type: DataType.DECIMAL(10, 6),
    allowNull: false,
    defaultValue: '0.0',
  })
  declare longitude?: number | null;
}
