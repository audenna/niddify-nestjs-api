import { Column, DataType, Table } from 'sequelize-typescript';
import { NamedModel } from '../../../common/models/models';

@Table({ tableName: 'categories' })
export class Category extends NamedModel<Category> {
  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
  declare iconUrl: string;
}
