import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Index,
  Table,
} from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { RefreshTokenModelInterface } from '../interfaces/refresh.token.model.interface';
import { AuthUser } from '../../auth-user/models/auth.user.model';
import { UuidModel } from '../../../common/models/models';

@Table({ tableName: 'refresh_tokens' })
export class RefreshToken
  extends UuidModel<
    InferAttributes<RefreshToken>,
    InferCreationAttributes<RefreshToken>
  >
  implements RefreshTokenModelInterface
{
  @ForeignKey(() => AuthUser)
  @Index
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare authUserId: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare token: string;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare isRevoked: boolean;

  @Column({ type: DataType.DATE, allowNull: true })
  declare expiresAt: Date;

  @BelongsTo(() => AuthUser, { foreignKey: 'authUserId' })
  declare authUser?: AuthUser;
}
