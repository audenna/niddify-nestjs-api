import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfigService {
  constructor(private readonly configService: ConfigService) {}

  get host(): string {
    return String(this.configService.get<string>('database.host'));
  }

  get port(): number {
    return Number(this.configService.get<number>('database.port'));
  }

  get forwardPort(): number {
    return Number(this.configService.get<number>('database.forwardPort'));
  }

  get user(): string {
    return String(this.configService.get<string>('database.user'));
  }

  get password(): string {
    return String(this.configService.get<string>('database.password'));
  }

  get name(): string {
    return String(this.configService.get<string>('database.name'));
  }

  get isSync(): boolean {
    return Boolean(this.configService.get<boolean>('database.sync'));
  }
}
