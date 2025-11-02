import { Injectable } from '@nestjs/common';
import { FILE_UPLOAD_PROVIDER } from './decorators/file-upload.provider.decorator';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { RegistryService } from '../../common/registry/registry.service';
import { ImageUploadProvider } from './interfaces/file-upload-provider.interface';

@Injectable()
export class FileUploadProviderRegistry extends RegistryService<ImageUploadProvider> {
  constructor(discoveryService: DiscoveryService, reflector: Reflector) {
    super(
      discoveryService,
      reflector,
      FILE_UPLOAD_PROVIDER,
      (instance: ImageUploadProvider): instance is ImageUploadProvider =>
        typeof instance.uploadFile === 'function' && instance.isDefault,
    );
  }
}
