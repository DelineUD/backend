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

import { fileStorage } from '@shared/storage';
import { imageFileFilter } from '@utils/imageFileFilter';
import { JwtAuthGuard } from '../auth/guards/jwt-access.guard';
import { UploadService } from '@app/upload/upload.service';
import { UploadDto } from '@app/upload/dto/upload.dto';

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
    FilesInterceptor('files', 6, {
      storage: fileStorage,
      fileFilter: imageFileFilter,
    }),
  )
  public async upload(@Body() uploadDto: UploadDto, @UploadedFiles() files: Express.Multer.File[]) {
    return await this.uploadService.uploadImages(uploadDto, files);
  }
}
