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

import { UploadService } from '@app/upload/upload.service';
import { UploadDto } from '@app/upload/dto/upload.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-access.guard';
import { IUploadFile } from '@app/upload/interfaces/upload-file.interface';

@ApiTags('Uploads')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('uploadedFiles', 6))
  public async upload(
    @Body() uploadDto: UploadDto,
    @UploadedFiles() uploadedFiles: Express.Multer.File[],
  ): Promise<IUploadFile[]> {
    return await this.uploadService.upload(uploadDto, uploadedFiles);
  }
}
