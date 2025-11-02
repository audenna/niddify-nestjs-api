import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get name(): string {
    return String(this.configService.get<string>('app.name'));
  }

  get env(): string {
    return String(this.configService.get<string>('app.env'));
  }

  get host(): string {
    return String(this.configService.get<string>('app.host'));
  }

  get port(): number {
    return Number(this.configService.get<number>('app.port'));
  }

  get saltOrRounds(): number {
    return Number(this.configService.get<number>('app.saltOrRounds'));
  }

  get jwtSecret(): string {
    return String(this.configService.get<string>('app.jwtSecret'));
  }

  get jwtExpTime(): string {
    return String(this.configService.get<string>('app.jwtExpTime'));
  }

  get jwtRefreshExpTime(): string {
    return String(this.configService.get<string>('app.jwtRefreshExpTime'));
  }

  get adminEmail(): string {
    return String(this.configService.get<string>('app.adminEmail'));
  }

  get adminFirstName(): string {
    return String(this.configService.get<string>('app.adminFirstName'));
  }

  get adminLastName(): string {
    return String(this.configService.get<string>('app.adminLastName'));
  }

  get adminPassword(): string {
    return String(this.configService.get<string>('app.adminPassword'));
  }
}
