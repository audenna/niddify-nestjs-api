import { IAuditLog } from '../interfaces/audit-log.interface';
import { AuditLogAction } from '../enums/audit-log-action.enum';
import { AuditLogStatus } from '../enums/audit-log-status.enum';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAuditLogDto implements IAuditLog {
  @IsString()
  @IsNotEmpty()
  actorId: string;

  @IsIn(Object.values(AuditLogAction))
  @IsString()
  @IsNotEmpty()
  action: AuditLogAction;

  @IsString()
  @IsNotEmpty()
  actionableType: string;

  @IsString()
  @IsNotEmpty()
  actionableId: string;

  @IsIn(Object.values(AuditLogStatus))
  @IsString()
  @IsNotEmpty()
  status: AuditLogStatus;

  @IsString()
  @IsOptional()
  targetType?: string;

  @IsString()
  @IsOptional()
  targetId?: string;

  @IsString()
  @IsOptional()
  modelType?: string;

  @IsString()
  @IsOptional()
  modelId?: string;

  @IsObject()
  @IsOptional()
  fields?: Record<string, any>;

  @IsObject()
  @IsOptional()
  original?: Record<string, any>;

  @IsObject()
  @IsOptional()
  changes?: Record<string, any>;

  @IsString()
  @IsOptional()
  exception?: string;
}
