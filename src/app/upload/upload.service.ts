import { Injectable, Logger } from '@nestjs/common';

const logger = new Logger('Filters');

@Injectable()
export class UploadService {
  async uploadImages(_, files: Express.Multer.File[]): Promise<string[]> {
    try {
      return files.map((file) => `${process.env.SERVER_URL}/${process.env.STATIC_PATH}/${file.filename}`);
    } catch (err) {
      logger.error(`Error while uploadImages: ${(err as Error).message}`);
      throw err;
    }
  }
}
