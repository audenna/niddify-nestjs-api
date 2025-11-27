import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Index,
  Table,
} from 'sequelize-typescript';
import { UuidModel } from '../../../common/models/models';
import { IHome } from '../interfaces/home.interface';
import { HomeStatus } from '../enums/home-status.enum';
import { HomeType } from './home-type.model';
import { AuthUser } from '../../auth-user/models/auth.user.model';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { HomeCoverPhoto } from './home-cover-photo.model';
import { HomeContact } from './home-contact.model';

@Table({ tableName: 'homes' })
export class Home
  extends UuidModel<InferAttributes<Home>, InferCreationAttributes<Home>>
  implements IHome
{
  @ForeignKey(() => HomeType)
  @Index
  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null })
  declare typeId?: number | null;

  @ForeignKey(() => AuthUser)
  @Index
  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null })
  createdById?: number;

  @Index
  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
  declare logoUrl?: string;

  @Column({ type: DataType.TEXT, allowNull: true, defaultValue: null })
  declare briefDescription: string;

  @Column({ type: DataType.TEXT, allowNull: true, defaultValue: null })
  declare description: string;

  @Column({ type: DataType.TEXT, allowNull: true, defaultValue: null })
  declare address: string;

  @Index
  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
  declare city: string;

  @Index
  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
  declare state: string;

  @Index
  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
  declare country: string;

  @Index
  @Column({
    type: DataType.DECIMAL(10, 6),
    allowNull: true,
    defaultValue: null,
  })
  declare lat: number;

  @Index
  @Column({
    type: DataType.DECIMAL(10, 6),
    allowNull: true,
    defaultValue: null,
  })
  declare lng: number;

  @Index
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: HomeStatus.APPROVED,
  })
  declare status?: HomeStatus;

  @Column({ type: DataType.DECIMAL(50, 2), defaultValue: 0.0 })
  declare walletBalance?: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: null,
  })
  declare landmark?: string;

  @Index
  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  declare websiteUrl?: string;

  @Index
  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    defaultValue: null,
  })
  declare foundedAt?: string;

  @BelongsTo(() => HomeType, {
    foreignKey: 'typeId',
    onDelete: 'SET NULL',
    as: 'type',
  })
  declare type?: HomeType;

  @BelongsTo(() => AuthUser, {
    foreignKey: 'createdById',
    onDelete: 'SET NULL',
  })
  createdBy?: AuthUser;

  @HasMany(() => HomeCoverPhoto, { foreignKey: 'homeId' })
  coverPhotos?: HomeCoverPhoto[];

  @HasMany(() => HomeContact, { foreignKey: 'homeId' })
  contacts?: HomeContact[];
}
