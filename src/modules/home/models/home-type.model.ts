import { Table } from 'sequelize-typescript';
import { NamedModel } from '../../../common/models/models';

@Table({ tableName: 'home_types' })
export class HomeType extends NamedModel<HomeType> {}
