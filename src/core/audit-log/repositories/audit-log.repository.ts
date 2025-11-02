import { BaseRepository } from '../../../common/repositories/base.repository';
import { AuditLog } from '../models/audit-log.model';
import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditLogRepository extends BaseRepository<AuditLog> {
  constructor(@InjectModel(AuditLog) model: typeof AuditLog) {
    super(model);
  }
}
