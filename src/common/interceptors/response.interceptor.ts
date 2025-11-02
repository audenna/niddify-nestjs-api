import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResponseDto } from '../dto/api-response/types/api.response.dto';
import { MetaDto } from '../dto/api-response/types/meta.dto';
import { ErrorDto } from '../dto/api-response/types/error.dto';
import { ResponseShape } from '../dto/api-response/interfaces/api.response.shape.dto';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<ResponseShape<T>, ApiResponseDto<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler<ResponseShape<T>>,
  ): Observable<ApiResponseDto<T>> {
    return next.handle().pipe(
      map((data): ApiResponseDto<T> => {
        if (!data || typeof data !== 'object') {
          // Fallback in case the response is undefined/null/non-object
          return new ApiResponseDto<T>(
            'NOT_AVAILABLE',
            'error',
            'Unexpected error: invalid response structure',
            null,
            null,
            {
              details: 'Response was not a valid object.',
              code: 'INVALID_RESPONSE',
            },
          );
        }

        const meta: MetaDto | undefined = data?.meta;

        const error: ErrorDto | undefined = data.error ?? undefined;

        return new ApiResponseDto<T>(
          data.code ?? 'NOT_AVAILABLE',
          data.error ? 'error' : 'success',
          data.message ?? (data.error ? 'An error occurred' : 'Success'),
          data.data,
          meta ?? null,
          error,
        );
      }),
    );
  }
}
