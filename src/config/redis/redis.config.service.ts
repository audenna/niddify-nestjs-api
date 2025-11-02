import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfigService {
  constructor(private readonly configService: ConfigService) {}

  get host(): string {
    return String(this.configService.get<string>('redis.host'));
  }

  get port(): number {
    return Number(this.configService.get<number>('redis.port'));
  }

  get forwardPort(): number {
    return Number(this.configService.get<number>('redis.forwardPort'));
  }

  get user(): string {
    return String(this.configService.get<string>('redis.user'));
  }

  get password(): string {
    return String(this.configService.get<string>('redis.password'));
  }
}
