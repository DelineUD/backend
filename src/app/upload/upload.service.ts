import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  getUploadedFiles(files: Express.Multer.File[]): string[] {
    return files.map((file) => `${process.env.SERVER_URL}/${process.env.STATIC_PATH}/${file.filename}`);
  }
}
