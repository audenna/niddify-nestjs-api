import { Module } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuditLog } from './models/audit-log.model';
import { AuditLogRepository } from './repositories/audit-log.repository';

@Module({
  imports: [SequelizeModule.forFeature([AuditLog])],
  providers: [AuditLogService, AuditLogRepository],
  exports: [AuditLogService],
})
export class AuditLogModule {}
