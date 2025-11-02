import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleConfigService {
  constructor(private readonly configService: ConfigService) {}

  get googleApiUri(): string {
    return String(this.configService.get<string>('google.googleApiUri'));
  }

  get googleClientId(): string {
    return String(this.configService.get<string>('google.googleClientId'));
  }

  get googleSecretKey(): string {
    return String(this.configService.get<string>('google.googleSecretKey'));
  }

  get googleApiKey(): string {
    return String(this.configService.get<string>('google.googleApiKey'));
  }
}
