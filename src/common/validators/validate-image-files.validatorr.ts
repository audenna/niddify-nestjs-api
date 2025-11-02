export const imageFileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp|jpg)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};
