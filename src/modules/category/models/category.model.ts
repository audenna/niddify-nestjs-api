import { Table } from 'sequelize-typescript';
import { NamedModel } from '../../../common/models/models';

@Table({ tableName: 'categories' })
export class Category extends NamedModel<Category> {}
