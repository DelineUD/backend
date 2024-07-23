import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/auth/guards/jwt-access.guard';
import { fileStorageConfig } from '@app/shared/storage/storage.config';
import { mediaFileFilter } from '@app/shared/utils/mediaFileFilter';
import { UploadDto } from '@app/upload/dto/upload.dto';
import { IUploadFile } from '@app/upload/interfaces/upload-file.interface';
import { UploadService } from '@app/upload/upload.service';

@ApiTags('Uploads')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('uploadedFiles', 4, {
      storage: fileStorageConfig,
      fileFilter: mediaFileFilter,
    }),
  )
  public async upload(
    @Body() uploadDto: UploadDto,
    @UploadedFiles() uploadedFiles: Express.Multer.File[],
  ): Promise<IUploadFile[]> {
    return await this.uploadService.upload(uploadDto, uploadedFiles);
  }
}
