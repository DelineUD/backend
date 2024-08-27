import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

export const mediaFileFilter = async (_: Request, file: Express.Multer.File, callback: any) => {
  try {
    console.log(file);
    // Check file type and size
    if (!file.originalname.match(/\.(jpe?g|png|webp|gif|mp4|m4a|avi|mov|ogg)$/i)) {
      return callback(new BadRequestException('Only image, video, and valid format files are allowed!'), false);
    }

    // Limit 100 MB
    if (file.size > 100 * 1024 * 1024) {
      return callback(new BadRequestException('File too large!'), false);
    }

    callback(null, true);
  } catch (error) {
    console.error('Error processing file:', error);
    callback(new BadRequestException('Error processing file'), false);
  }
};
