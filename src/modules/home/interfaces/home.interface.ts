import { INamedModelAttribute } from '../../../common/models/interfaces/named-model.attribute.interface';

export interface IHomeType extends INamedModelAttribute {
  uuid?: string;
  name: string;
  description?: string | null;
}
