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

    // Step 1: Build cursor condition
    const cursorCondition = buildCursorWhereClause(
      cursorField,
      orderDirection,
      cursor,
      cursorField === 'createdAt' || cursorField === 'updatedAt',
    );

    const combinedWhere = { ...where, ...cursorCondition };

    // Step 2: Fetch only IDs (to paginate cleanly)
    const baseRows = await this.model.findAll({
      where: combinedWhere,
      attributes: ['id'],
      order: [
        [cursorField, orderDirection],
        ['id', orderDirection],
      ],
      limit: limit + 1,
    });

    const ids = baseRows.map((r) => r.id);
    if (ids.length === 0) {
      return formatResponse([], limit, cursorField);
    }

    // Step 3: Fetch full records with includes, filtering by IDs
    const results = await this.model.findAll({
      // @ts-ignore
      where: { id: { [Op.in]: ids } },
      include,
      attributes,
      order: [
        [cursorField, orderDirection],
        ['id', orderDirection],
      ],
    });

    return formatResponse(results, limit, cursorField);
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
