import { Module } from '@nestjs/common';

import { UploadService } from './upload.service';
import { UploadController } from '@app/upload/upload.controller';

@Module({
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService],
})
export class UploadModule {}
