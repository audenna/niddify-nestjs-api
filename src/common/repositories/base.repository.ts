import { Model, ModelCtor } from 'sequelize-typescript';
import {
  InferAttributes,
  InferCreationAttributes,
  CreationAttributes,
  WhereOptions,
  FindOptions,
  Transaction,
  Includeable,
  Op,
} from 'sequelize';
import {
  CursorPaginationParamsInterface,
  CursorPaginationResultInterface,
} from '../pagination/interfaces/cursor-pagination.interface';
import {
  buildCursorWhereClause,
  formatResponse,
} from '../pagination/cursor.helper';

export class BaseRepository<
  T extends Model<InferAttributes<T>, InferCreationAttributes<T>>,
> {
  constructor(protected readonly model: ModelCtor<T>) {}

  async create(
    data: CreationAttributes<T>,
    transaction?: Transaction,
  ): Promise<T> {
    return await this.model.create(data, transaction ? { transaction } : {});
  }

  async createMany(
    data: Array<CreationAttributes<T>>,
    options?: {
      transaction?: Transaction;
      include?: Includeable[];
    },
  ): Promise<T[]> {
    return await this.model.bulkCreate(data, {
      validate: true,
      ignoreDuplicates: true,
      ...(options?.transaction && { transaction: options.transaction }),
      ...(options?.include && { include: options.include }),
    });
  }

  async update(
    id: number,
    data: Partial<InferAttributes<T>>,
    transaction?: Transaction,
  ): Promise<T | null> {
    const instance = await this.model.findByPk(id);
    if (!instance) return null;

    await instance.update(data, transaction ? { transaction } : {});
    return instance;
  }

  async updateManyByCondition(
    condition: WhereOptions<InferAttributes<T>>,
    data: Partial<InferAttributes<T>>,
    transaction?: Transaction,
  ): Promise<number> {
    const [affectedRows] = await this.model.update(data, {
      where: condition,
      ...(transaction && { transaction }),
    });

    return affectedRows;
  }

  async updateByCondition(
    condition: WhereOptions<InferAttributes<T>>,
    data: Partial<InferAttributes<T>>,
    transaction?: Transaction,
  ): Promise<number> {
    const [affectedRows] = await this.model.update(data, {
      where: condition,
      ...(transaction && { transaction }),
    });

    return affectedRows;
  }

  async findAll(
    condition: WhereOptions<InferAttributes<T>> = {},
    transaction?: Transaction,
  ): Promise<T[]> {
    return await this.model.findAll({
      where: condition,
      ...(transaction && { transaction }),
    });
  }

  async findOneById(
    id: number,
    options?: FindOptions<InferAttributes<T>>,
  ): Promise<T | null> {
    return this.model.findByPk(id, options);
  }

  async delete(
    id: number,
    transaction?: Transaction,
    force?: boolean,
  ): Promise<void> {
    const instance = await this.model.findByPk(
      id,
      transaction ? { transaction } : {},
    );

    if (instance) {
      await instance.destroy(transaction ? { transaction, force } : { force });
    }
  }

  /**
   * Example usage:
   *  const record = await this.repository.findOneByCondition(
   *     { id: 1 },
   *     { transaction },
   *   );
   * @param condition
   * @param options
   */
  async findOneByCondition(
    condition: WhereOptions<InferAttributes<T>>,
    options?: Omit<FindOptions<InferAttributes<T>>, 'where'> & {
      transaction?: Transaction;
    },
  ): Promise<T | null> {
    return await this.model.findOne({
      where: condition,
      ...options,
    });
  }

  async findWithCursorPagination(
    params: CursorPaginationParamsInterface<T>,
    addIncludeToBaseQuery: boolean = false,
  ): Promise<CursorPaginationResultInterface<T>> {
    const {
      limit,
      cursor,
      cursorField,
      where = {},
      orderDirection = 'ASC',
      include,
      attributes,
    } = params;

    const cursorCondition = buildCursorWhereClause(
      cursorField,
      orderDirection,
      cursor,
      cursorField === 'createdAt' || cursorField === 'updatedAt',
    );

    const combinedWhere = { ...where, ...cursorCondition };

    const baseRows = await this.model.findAll({
      where: combinedWhere,
      attributes: ['id', cursorField],
      order: [
        [cursorField, orderDirection],
        ['id', orderDirection],
      ],
      limit: limit + 1,
      include: addIncludeToBaseQuery ? include : [],
      subQuery: false,
      distinct: true,
    } as any);

    if (baseRows.length === 0) {
      return formatResponse([], limit, cursorField, cursor);
    }

    const hasNextPage = baseRows.length > limit;
    const idsForPage = hasNextPage
      ? baseRows.slice(0, limit).map((r) => Number(r.id))
      : baseRows.map((r) => Number(r.id));

    const results = await this.model.findAll({
      where: { id: { [Op.in]: idsForPage } },
      include,
      attributes,
      order: [
        [cursorField, orderDirection],
        ['id', orderDirection],
      ],
    } as any);

    if (hasNextPage) {
      results.push(baseRows[limit]);
    }

    return formatResponse(results, limit, cursorField, cursor);
  }

  async getReferences(
    columnName: string = 'reference',
  ): Promise<string[] | []> {
    const references = await this.model.findAll({
      attributes: [columnName],
    });

    if (!references.length) {
      return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return references.map((rec) => rec[columnName] ?? null);
  }

  async countRecords(where?: Record<string, any>): Promise<number> {
    return this.model.count({ where });
  }

  async sumRecords<K extends keyof InferAttributes<T>>(
    fieldToSum: K,
    where?: Record<string, any>,
  ): Promise<number> {
    const total = await this.model.sum(fieldToSum, where ? { where } : {});

    return total ?? 0;
  }
}
