import { CursorPaginationResultInterface } from './interfaces/cursor-pagination.interface';
import { Op } from 'sequelize';

export interface ICompositeCursorParams {
  value: string | number;
  id: string | number;
}

export function encodeCursor(parms: ICompositeCursorParams): string {
  return Buffer.from(JSON.stringify(parms)).toString('base64');
}

export function decodeCursor(base64: string): ICompositeCursorParams {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
}

export function buildCursorWhereClause(
  cursorKey: 'id' | 'createdAt' | 'updatedAt',
  orderDirection: 'ASC' | 'DESC',
  cursor: string | null | undefined,
  isDate = true,
): object {
  if (!cursor) return {};

  const decoded: ICompositeCursorParams = decodeCursor(cursor);
  const parsedValue = isDate ? new Date(decoded.value) : decoded.value;

  const opMain = orderDirection === 'ASC' ? Op.gt : Op.lt;
  const opTie = orderDirection === 'ASC' ? Op.gt : Op.lt;

  return {
    [Op.or]: [
      {
        [cursorKey]: { [opMain]: parsedValue },
      },
      {
        [cursorKey]: parsedValue,
        id: { [opTie]: decoded.id },
      },
    ],
  };
}

export function formatResponse<T>(
  records: T[] = [],
  limit: number,
  cursorKey: 'updatedAt' | 'createdAt' = 'updatedAt',
  inputCursor?: string | null,
): CursorPaginationResultInterface<T> {
  let nextCursor: string | null = null;
  let previousCursor: string | null = null;

  if (records.length > limit) {
    // There IS a next page — cut the extra and build nextCursor
    records.pop();
    const lastItem = records[records.length - 1];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const lastCursorValue = lastItem[cursorKey];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const lastCursorId = lastItem['id'];

    nextCursor = encodeCursor({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      value:
        lastCursorValue instanceof Date
          ? lastCursorValue.toISOString()
          : lastCursorValue,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      id: lastCursorId,
    });
  } else {
    // Size is <= limit → no next page
    nextCursor = null;
  }

  if (records.length && inputCursor) {
    const firstItem = records[0];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const firstCursorValue = firstItem[cursorKey];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const firstCursorId = firstItem['id'];

    previousCursor = encodeCursor({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      value:
        firstCursorValue instanceof Date
          ? firstCursorValue.toISOString()
          : firstCursorValue,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      id: firstCursorId,
    });
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    previousCursor = null;
  }

  return { records, nextCursor };
}
