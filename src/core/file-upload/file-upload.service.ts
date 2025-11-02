import { BadRequestException, Injectable } from '@nestjs/common';
import { AppLogger } from '../logger/logger.service';
import { FileUploadProviderRegistry } from './file-upload.provider.registry';
import {
  FileUploadResult,
  ImageUploadProvider,
} from './interfaces/file-upload-provider.interface';

@Injectable()
export class FileUploadService {
  private readonly DEFAULT_PROVIDER = 'cloudinary';

  constructor(
    private readonly logger: AppLogger,
    private readonly registry: FileUploadProviderRegistry,
  ) {
    this.logger = logger.withContext(FileUploadService.name);
  }

  async handleFileUpload(
    file: Express.Multer.File,
    providerName?: string,
  ): Promise<FileUploadResult | null> {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    const provider: ImageUploadProvider | null = this.registry.getProvider(
      providerName ?? this.DEFAULT_PROVIDER,
    );

    if (!provider) {
      this.logger.error(`${this.DEFAULT_PROVIDER} has not been defined yet.`);
      throw new Error('Unable to determine a service provider');
    }

    try {
      this.logger.log(`File upload provider set to:: ${this.DEFAULT_PROVIDER}`);
      const response = await provider.uploadFile(file);
      this.logger.log(`File upload response from ${this.DEFAULT_PROVIDER}`);
      this.logger.log(response);

      return response;
    } catch (e) {
      this.logger.error(
        `Internal server error occurred while uploading a file though: ${this.DEFAULT_PROVIDER}`,
      );
      this.logger.error(e);
      return null;
    }
  }

  async handleMultipleUploads(
    files: Express.Multer.File[],
    providerName: string = 'aws-s3',
  ): Promise<FileUploadResult[] | []> {
    const results: FileUploadResult[] = [];
    if (!files.length) return [];

    for (const file of files) {
      const result: FileUploadResult | null = await this.handleFileUpload(
        file,
        providerName,
      );
      if (result) {
        results.push({ url: result.url, publicId: result.publicId });
      }
    }

    return results;
  }
}
