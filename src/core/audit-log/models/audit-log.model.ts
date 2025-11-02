import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { Column, DataType, Index, Model, Table } from 'sequelize-typescript';
import { AuditLogStatus } from '../enums/audit-log-status.enum';
import { IAuditLog } from '../interfaces/audit-log.interface';
import { AuditLogAction } from '../enums/audit-log-action.enum';

@Table({ tableName: 'audit_logs' })
export class AuditLog
  extends Model<InferAttributes<AuditLog>, InferCreationAttributes<AuditLog>>
  implements IAuditLog
{
  @Index({ unique: true, name: 'batchId_unique' })
  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  declare batchId?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare actorId: string;

  @Index
  @Column({ type: DataType.STRING, allowNull: false })
  declare action: AuditLogAction;

  @Index
  @Column({ type: DataType.STRING, allowNull: false })
  declare actionableType: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare actionableId: string;

  @Index
  @Column({ type: DataType.STRING, allowNull: true })
  declare targetType?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare targetId?: string;

  @Index
  @Column({ type: DataType.STRING, allowNull: true })
  declare modelType?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare modelId?: string;

  @Column({ type: DataType.JSON, allowNull: true })
  declare fields?: Record<string, any>;

  @Column({ type: DataType.JSON, allowNull: true })
  declare original?: Record<string, any>;

  @Column({ type: DataType.JSON, allowNull: true })
  declare changes?: Record<string, any>;

  @Index
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: AuditLogStatus.QUEUED,
  })
  declare status: AuditLogStatus;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare exception?: string;
}
