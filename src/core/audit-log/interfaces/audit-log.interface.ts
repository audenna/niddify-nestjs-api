import { AuditLogStatus } from '../enums/audit-log-status.enum';
import { AuditLogAction } from '../enums/audit-log-action.enum';

export interface IAuditLog {
  actorId: string;
  action: AuditLogAction;
  actionableType: string;
  actionableId: string;
  batchId?: string;
  targetType?: string;
  targetId?: string;
  modelType?: string;
  modelId?: string;
  fields?: Record<string, any>;
  original?: Record<string, any>;
  changes?: Record<string, any>;
  status: AuditLogStatus;
  exception?: string;
}
