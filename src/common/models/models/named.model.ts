import { INamedModelAttribute } from '../interfaces/named-model.attribute.interface';
import { Column, DataType, Index } from 'sequelize-typescript';
import { UuidModel } from './uuid.model';

export abstract class NamedModel<T extends object = any>
  extends UuidModel<T>
  implements INamedModelAttribute
{
  @Index
  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.TEXT, allowNull: true, defaultValue: null })
  declare description: string | null;
}
