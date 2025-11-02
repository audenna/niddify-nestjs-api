import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsEmailConfigService {
  constructor(private readonly configService: ConfigService) {}

  get awsRegion(): string {
    return String(this.configService.get<string>('ses.awsRegion'));
  }

  get sendFromEmail(): string {
    return String(this.configService.get<string>('ses.sendFromEmail'));
  }

  get sendFromName(): string {
    return String(this.configService.get<string>('ses.sendFromName'));
  }

  get sesAccessKeyId(): string {
    return String(this.configService.get<string>('ses.sesAccessKeyId'));
  }

  get sesSecretKey(): string {
    return String(this.configService.get<string>('ses.sesSecretKey'));
  }
}
