import { SetMetadata } from '@nestjs/common';

export const FILE_UPLOAD_PROVIDER = 'FILE_UPLOAD_PROVIDER';

export const FileUploadProvider = (name: string) =>
  SetMetadata(FILE_UPLOAD_PROVIDER, name);
