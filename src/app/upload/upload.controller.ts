import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiResponse } from '@nestjs/swagger';
import { diskStorage } from 'multer';

import { editFileName, imageFileFilter } from './upload.service';
import { UploadImgEntity } from './entities/upload-img.entity';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadedFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return {
      originalname: file.originalname,
      filename: file.filename,
      url: String(process.env.YA_URL + file.filename),
    };
  }

  @Post('upload-images')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Загрузка картинок',
    type: UploadImgEntity,
  })
  @UseInterceptors(
    FilesInterceptor('image', 4, {
      storage: diskStorage({
        destination: process.env.STATIC_PATH_FOLDER,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadMultipleFiles(
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    const response = [];
    files.forEach((file) => {
      const fileReponse = {
        originalname: file.originalname,
        filename: file.filename,
        url: `${process.env.STATIC_PATH}/${file.filename}`,
      };
      response.push(fileReponse);
    });
    return response;
  }

  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, {
      root: './files',
    });
  }
}
