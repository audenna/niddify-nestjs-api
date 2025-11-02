import { Injectable } from '@nestjs/common';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditLogRepository } from './repositories/audit-log.repository';
import { PaginationFiltersDto } from '../../common/dto/filters/pagination-filters.dto';
import { successResponse } from '../../common/dto/api-response/api.response.handler';
import { ResponseCode } from '../../common/enums';
import { AuditLog } from './models/audit-log.model';
import { Transaction } from 'sequelize';

/**
 * This should be imported in the Model services you want to implement the
 * audit log
 */
@Injectable()
export class AuditLogService {
  constructor(private readonly repo: AuditLogRepository) {}

  async logAction(
    dto: CreateAuditLogDto,
    transaction?: Transaction,
  ): Promise<AuditLog> {
    return await this.repo.create(dto, transaction);
  }

  async fetchAllAuditLogs(
    filter: PaginationFiltersDto,
    include: [],
  ): Promise<any> {
    const logs = await this.repo.findWithCursorPagination({
      limit: filter.size,
      cursor: filter.cursor,
      cursorField: 'updatedAt',
      orderDirection: 'DESC',
      include,
    });

    return successResponse(ResponseCode.OK, logs, 'Audit Logs');
  }

  getChangedFields<T extends object>(
    oldValues: T,
    newValues: Partial<T>,
  ): Record<string, { before: any; after: any }> {
    const changes: Record<string, { before: any; after: any }> = {};

    for (const key of Object.keys(newValues)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      const before = (oldValues as any)[key];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      const after = (newValues as any)[key];

      // only include if value is actually different
      if (after !== undefined && before !== after) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        changes[key] = { before, after };
      }
    }

    return changes;
  }
}
