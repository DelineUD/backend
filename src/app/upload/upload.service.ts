import { Injectable, Logger } from '@nestjs/common';

import { IUploadFile } from '@app/upload/interfaces/upload-file.interface';
import { getUploadedFilesWithType } from '@helpers/getUploadedFilesWithType';
import { ConvertsService } from '@app/converts/converts.service';
import { UploadDto } from '@app/upload/dto/upload.dto';

const logger = new Logger('Uploads');

@Injectable()
export class UploadService {
  constructor(private readonly convertsService: ConvertsService) {}

  async upload(_: UploadDto, uploadedFiles: Express.Multer.File[]): Promise<IUploadFile[]> {
    try {
      // Convert files
      const convertedFiles: Express.Multer.File[] = await this.convertsService.getConvertedStaticFiles(
        uploadedFiles,
        this.convertsService.convertToMp4.bind(this.convertsService),
      );

      return getUploadedFilesWithType(convertedFiles ?? []);
    } catch (err) {
      logger.error(`Error while upload: ${(err as Error).message}`);
      throw err;
    }
  }
}
