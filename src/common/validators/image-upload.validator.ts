import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { BadRequestException } from '@nestjs/common';

export function imageFileFilter(
  allowedTypes: string[] = ['jpeg', 'png', 'jpg', 'gif'],
): MulterOptions['fileFilter'] {
  return (req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      return callback(
        new BadRequestException('Only image files are allowed!'),
        false,
      );
    }

    const ext = file.mimetype.split('/')[1];
    if (!allowedTypes.includes(ext)) {
      return callback(
        new BadRequestException(
          `Invalid image type. Allowed types: ${allowedTypes.join(', ')}`,
        ),
        false,
      );
    }

    callback(null, true);
  };
}

export function maxFileSize(bytes: number): MulterOptions['limits'] {
  return { fileSize: bytes };
}
