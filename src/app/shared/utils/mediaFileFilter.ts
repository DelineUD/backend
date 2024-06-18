import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';

export const mediaFileFilter = (_: Request, file: Express.Multer.File, callback: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp4|avi|mov)$/)) {
    return callback(new BadRequestException('Only image and video files are allowed!'), false);
  }
  if (file.size > 50 * 1024 * 1024) {
    return callback(new BadRequestException('File too large!'), false);
  }
  callback(null, true);
};
