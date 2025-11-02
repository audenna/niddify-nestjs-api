import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import {
  ImageUploadProvider,
  FileUploadResult,
} from '../interfaces/file-upload-provider.interface';
import { AppLogger } from '../../logger/logger.service';
import { FileUploadProvider } from '../decorators/file-upload.provider.decorator';
import { FileUploadConfigService } from '../../../config/file-upload/file-upload.config.service';

@FileUploadProvider('cloudinary')
@Injectable()
export class CloudinaryService implements ImageUploadProvider {
  name = 'cloudinary';
  isDefault = false;

  constructor(
    private readonly logger: AppLogger,
    private uploadConfig: FileUploadConfigService,
  ) {
    this.logger = logger.withContext(CloudinaryService.name);
    this.initialize();
  }

  private initialize(): void {
    cloudinary.config({
      cloud_name: this.uploadConfig.cloudinaryName,
      api_key: this.uploadConfig.cloudinaryApiKey,
      api_secret: this.uploadConfig.cloudinarySecret,
    });
  }

  private getResourceType(mimeType: string): 'image' | 'video' | 'raw' {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    return 'raw'; // e.g., application/pdf, application/zip, etc.
  }

  async uploadFile(file: Express.Multer.File): Promise<FileUploadResult> {
    this.logger.log(`Uploading file through ${this.name}...`);

    try {
      const result = await new Promise<
        ReturnType<typeof cloudinary.uploader.upload>
      >((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'uploads',
            public_id: file.originalname.split('.')[0],
            resource_type: this.getResourceType(file.mimetype),
          },
          (error, result) => {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            if (error) return reject(error);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            resolve(result!);
          },
        );
        // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
        require('stream').Readable.from(file.buffer).pipe(uploadStream);
      });

      this.logger.log(`Uploaded: ${result.secure_url}`);
      this.logger.log(result);

      return { url: result.secure_url, publicId: result.asset_id as string };
    } catch (error) {
      this.logger.error('Upload failed');
      this.logger.error(error);
      throw error;
    }
  }
}
