import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { FileUploadProviderRegistry } from './file-upload.provider.registry';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { CloudinaryService } from './providers/cloudinary.service';

@Module({
  imports: [DiscoveryModule],
  providers: [FileUploadProviderRegistry, FileUploadService, CloudinaryService],
  controllers: [FileUploadController],
  exports: [FileUploadService],
})
export class FileUploadModule {}
