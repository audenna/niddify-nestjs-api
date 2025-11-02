import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { CursorPaginatedRequest } from '../interfaces/cursor-pagination-request.interface';
/**
 * Example usage:
 * import { CursorPaginatedRequest } from 'src/common/interfaces/cursor-pagination-request.interface';
 *
 * @Get('paginated')
 * getPaginated(@Req() req: CursorPaginatedRequest) {
 *   const { cursor, size } = req.cursorPagination;
 *   return this.service.getPaginatedData({ cursor, limit: size });
 * }
 */
@Injectable()
export class CursorPaginationMiddleware implements NestMiddleware {
  use = (
    req: CursorPaginatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    const MAX_PAGE_SIZE = 100;
    const { nextCursor, limit } = req.query;

    const sizeAsNumber = parseInt(limit as string, 10);
    let size =
      Number.isNaN(sizeAsNumber) || sizeAsNumber < 1 ? 10 : sizeAsNumber;
    size = Math.min(size, MAX_PAGE_SIZE);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (req as any).cursorPagination = { cursor: nextCursor, size };

    next();
  };
}
