import { Injectable, Logger } from '@nestjs/common';

import { IUploadFile } from '@app/upload/interfaces/upload-file.interface';
import { getUploadedFilesWithType } from '@helpers/getUploadedFilesWithType';

const logger = new Logger('Filters');

@Injectable()
export class UploadService {
  async upload(_, uploadedFiles: Express.Multer.File[]): Promise<IUploadFile[]> {
    try {
      return getUploadedFilesWithType(uploadedFiles);
    } catch (err) {
      logger.error(`Error while uploadImages: ${(err as Error).message}`);
      throw err;
    }
  }
}
