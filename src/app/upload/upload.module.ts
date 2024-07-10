import { Module } from '@nestjs/common';

import { UploadController } from '@app/upload/upload.controller';
import { ConvertModule } from '@app/converts/converts.module';
import { UploadService } from './upload.service';

@Module({
  imports: [ConvertModule],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService],
})
export class UploadModule {}
