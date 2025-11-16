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

    // Extract the subtype: png, jpeg, jpg, gif, svg+xml etc.
    let subtype = file.mimetype.split('/')[1]?.toLowerCase();

    // Normalize jpeg → jpg (optional)
    if (subtype === 'jpeg') subtype = 'jpg';
    if (subtype.includes('+')) subtype = subtype.split('+')[0]; // handle "svg+xml"

    if (!allowedTypes.includes(subtype)) {
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
