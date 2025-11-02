import { Column, DataType, Index, Model } from 'sequelize-typescript';
import { IUUIDModelAttribute } from '../interfaces/named-model.attribute.interface';

export abstract class UuidModel<
    TModelAttributes extends object = any,
    TCreationAttributes extends object = TModelAttributes,
  >
  extends Model<TModelAttributes, TCreationAttributes>
  implements IUUIDModelAttribute
{
  @Index
  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  declare uuid?: string;
}
