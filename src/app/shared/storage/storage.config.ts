import * as path from 'path';
import { configDotenv } from 'dotenv';
import { diskStorage } from 'multer';
import { ForbiddenException } from '@nestjs/common';

import { editFileName } from '@utils/editFileName';

configDotenv({ path: path.resolve(`envs/.${process.env.NODE_ENV}.env`) });

export const fileStorageConfig = diskStorage({
  destination: (req, file, callback) => {
    const isImage = file.originalname.match(/\.(jpe?g|png|webp|gif)$/i);
    const isVideo = file.originalname.match(/\.(mp4|m4a|avi|mov|ogg)$/i);

    let uploadPath: string;

    if (isImage) {
      uploadPath = `${process.env.STATIC_PATH_FOLDER}/${process.env.IMAGES_FOLDER}`;
    } else if (isVideo) {
      uploadPath = `${process.env.STATIC_PATH_FOLDER}/${process.env.VIDEOS_FOLDER}`;
    } else {
      return callback(new ForbiddenException('Unsupported file type!'), process.env.STATIC_PATH_FOLDER);
    }

    callback(null, uploadPath);
  },
  filename: editFileName,
});
