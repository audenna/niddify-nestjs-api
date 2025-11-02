import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileUploadConfigService {
  constructor(private readonly configService: ConfigService) {}

  get cloudinaryName(): string {
    return String(this.configService.get<string>('file-upload.cloudinaryName'));
  }

  get cloudinaryApiKey(): string {
    return String(
      this.configService.get<string>('file-upload.cloudinaryApiKey'),
    );
  }

  get cloudinarySecret(): string {
    return String(
      this.configService.get<string>('file-upload.cloudinarySecret'),
    );
  }
}
