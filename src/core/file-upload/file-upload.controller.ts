import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { successResponse } from '../../common/dto/api-response/api.response.handler';
import { ResponseCode } from '../../common/enums';
import { maxFileSize } from '../../common/validators';

@Controller('media')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      // fileFilter: imageFileFilter(['jpeg', 'png', 'jpg', 'heic']),
      limits: maxFileSize(5 * 1024 * 1024), // 5 MB
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    return successResponse(
      ResponseCode.OK,
      await this.fileUploadService.handleFileUpload(file),
    );
  }
}
