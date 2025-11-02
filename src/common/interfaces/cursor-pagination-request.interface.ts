import { Request } from 'express';

export interface CursorPaginationParams {
  cursor?: string;
  size: number;
}

export interface CursorPaginatedRequest extends Request {
  cursorPagination: CursorPaginationParams;
}
