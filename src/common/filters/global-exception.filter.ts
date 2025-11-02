import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponseDto } from '../dto/api-response/types/api.response.dto';
import { ErrorDto } from '../dto/api-response/types/error.dto';

interface HttpExceptionResponse {
  message?: string | string[];
  error?: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorDetails: string | object = 'Unexpected error occurred';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const { message: msg, error } = res as HttpExceptionResponse;

        if (typeof msg === 'string') {
          message = msg;
        } else if (Array.isArray(msg)) {
          // 🔥 Return only the first validation error
          message = msg[0];
        } else if (typeof error === 'string') {
          message = error;
        }

        errorDetails = res;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errorDetails = exception.stack ?? exception.name;
    }

    const error: ErrorDto = {
      code: status,
      details: errorDetails,
    };

    console.error(error);

    const errorResponse = new ApiResponseDto('ERROR', 'error', message);

    response.status(status).json(errorResponse);
  }
}
