import { MetaDto } from './meta.dto';
import { ErrorDto } from './error.dto';

export class ApiResponseDto<T> {
  constructor(
    public code: string,
    public status: string,
    public message: string,
    public data?: T | null,
    public meta?: MetaDto | null,
    public error?: ErrorDto,
  ) {}
}
