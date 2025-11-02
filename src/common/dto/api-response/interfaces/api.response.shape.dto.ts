import { MetaDto } from '../types/meta.dto';
import { ErrorDto } from '../types/error.dto';

export interface ResponseShape<T> {
  code: string;
  message: string;
  data?: T;
  meta?: MetaDto;
  error?: ErrorDto | null;
}
