import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Index,
  Table,
} from 'sequelize-typescript';
import { UuidModel } from '../../../common/models/models';
import { IHomeCoverPhoto } from '../interfaces/home.interface';
import { Home } from './home.model';
import { InferAttributes, InferCreationAttributes } from 'sequelize';

@Table({ tableName: 'home_cover_photos' })
export class HomeCoverPhoto
  extends UuidModel<
    InferAttributes<HomeCoverPhoto>,
    InferCreationAttributes<HomeCoverPhoto>
  >
  implements IHomeCoverPhoto
{
  @ForeignKey(() => Home)
  @Index
  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null })
  declare homeId: number;

  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
  declare imageUrl: string;

  @BelongsTo(() => Home, { foreignKey: 'homeId', onDelete: 'CASCADE' })
  declare home?: Home;
}
