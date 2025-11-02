import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpException,
  Logger,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException, HttpException, BadRequestException)
export class WsExceptionFilter {
  protected readonly logger: Logger = new Logger(WsExceptionFilter.name);

  public catch(exception: WsException | HttpException, host: ArgumentsHost) {
    const client: Socket | null = host.switchToWs().getClient();
    this.handleError(exception, client);
  }

  public handleError(
    exception: HttpException | WsException,
    client: Socket | null,
  ) {
    if (!client) return;

    const error =
      exception instanceof WsException
        ? exception.getError()
        : exception.getResponse();

    let message = 'Authorization failed';

    if (typeof error === 'string') {
      message = error;
    } else if (typeof error === 'object' && error !== null) {
      const errObj = error as Record<string, unknown>;

      const msg = errObj.message;
      if (Array.isArray(msg) && typeof msg[0] === 'string') {
        message = msg[0];
      } else if (typeof msg === 'string') {
        message = msg;
      }
    }

    this.logger.error('Logging error', { message });
    client.emit('exception', { message });
  }
}
