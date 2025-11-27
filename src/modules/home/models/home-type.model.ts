import { Table } from 'sequelize-typescript';
import { NamedModel } from '../../../common/models/models';
import { IHomeType } from '../interfaces/home.interface';

@Table({ tableName: 'home_types' })
export class HomeType extends NamedModel<HomeType> implements IHomeType {}
