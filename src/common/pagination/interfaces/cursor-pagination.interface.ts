import { Model } from 'sequelize-typescript';
import {
  FindOptions,
  InferAttributes,
  Transaction,
  WhereOptions,
} from 'sequelize';

export interface CursorPaginationParamsInterface<T extends Model<any, any>> {
  limit: number;
  cursorField: 'updatedAt' | 'createdAt';
  cursor?: string;
  where?: WhereOptions<InferAttributes<T>>;
  orderDirection?: 'ASC' | 'DESC';
  transaction?: Transaction;
  include?: FindOptions['include'];
  attributes?: FindOptions['attributes'];
  group?: string[];
  distinct?: boolean;
  subQuery?: boolean;
}

export interface CursorPaginationResultInterface<T> {
  records: T[];
  previousCursor?: any;
  nextCursor?: any;
}
