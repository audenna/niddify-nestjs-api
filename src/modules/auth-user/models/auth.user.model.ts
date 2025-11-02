import { Table, Column, DataType, Index, HasOne } from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { AuthUserModelInterface } from '../interfaces/auth.user.model.interface';
import { RefreshToken } from '../../refresh-token/models/refresh.token.model';
import { RegTypeEnum, UserPresenceStatusEnum } from '../../../common/enums';
import { UserTypes } from '../../../common/enums/user.types';
import { Admin } from '../../admin/models/admin.model';
import { User } from '../../customer/models';
import { UuidModel } from '../../../common/models/models';

@Table({ tableName: 'auth_users', paranoid: true })
export class AuthUser
  extends UuidModel<
    InferAttributes<AuthUser>,
    InferCreationAttributes<AuthUser>
  >
  implements AuthUserModelInterface
{
  @Index
  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: 'This can be email, username, phone, etc',
    defaultValue: null,
  })
  declare username?: string | null;

  @Index
  @Column({ type: DataType.STRING, allowNull: false })
  declare userType: UserTypes;

  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
  declare firstName?: string | null;

  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
  declare lastName?: string | null;

  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
  declare passwordHash?: string | null;

  @Index
  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  declare emailAddress?: string | null;

  @Index
  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  declare phoneNumber?: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare hasVerifiedOTP?: boolean;

  @Index
  @Column({
    type: DataType.STRING,
    defaultValue: UserPresenceStatusEnum.VERIFY_ACCOUNT,
  })
  declare presenceStatus?: UserPresenceStatusEnum | string;

  @Index
  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
  declare otp?: string | null;

  @Column({ type: DataType.DATE, allowNull: true, defaultValue: null })
  declare otpExpiresAt?: Date | null;

  @Index
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: RegTypeEnum.NORMAL_AUTH,
  })
  declare signupChannel: RegTypeEnum;

  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
  declare profilePic?: string | null;

  @HasOne(() => RefreshToken, { foreignKey: 'authUserId', as: 'token' })
  declare authUserToken?: RefreshToken;

  @HasOne(() => User, { foreignKey: 'authUserId', as: 'user' })
  declare user?: User;

  @HasOne(() => Admin, { foreignKey: 'authUserId', as: 'admin' })
  declare admin?: Admin;

  @Column({ type: DataType.TEXT, allowNull: true, defaultValue: null })
  declare remarks?: string | null;

  toJSON() {
    const attributes = { ...this.get() };

    delete attributes.passwordHash;
    delete attributes.otp;
    delete attributes.otpExpiresAt;
    delete attributes.deletedAt;

    if (attributes['authUserId']) {
      delete attributes['authUserId'];
    }

    return attributes;
  }
}
