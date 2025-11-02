export interface FileUploadResult {
  url: string;
  publicId?: string;
}

export interface ImageUploadProvider {
  name: string;
  isDefault: boolean;
  uploadFile(file: Express.Multer.File): Promise<FileUploadResult>;
}
