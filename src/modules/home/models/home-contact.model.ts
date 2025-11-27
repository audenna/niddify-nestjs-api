import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Index,
  Table,
} from 'sequelize-typescript';
import { UuidModel } from '../../../common/models/models';
import { IHomeContact } from '../interfaces/home.interface';
import { Home } from './home.model';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { HomeContactType } from '../enums/home-contact-type.enum';

@Table({ tableName: 'home_contacts' })
export class HomeContact
  extends UuidModel<
    InferAttributes<HomeContact>,
    InferCreationAttributes<HomeContact>
  >
  implements IHomeContact
{
  @ForeignKey(() => Home)
  @Index
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare homeId: number;

  @BelongsTo(() => Home, { foreignKey: 'homeId', onDelete: 'CASCADE' })
  declare home?: Home;

  @Index
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: HomeContactType.email,
  })
  declare type: HomeContactType;

  @Index
  @Column({ type: DataType.STRING, allowNull: false })
  declare value: string;
}
