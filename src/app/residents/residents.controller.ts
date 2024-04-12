import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import e from 'express';

import { Types } from 'mongoose';

import { fileStorage } from '@shared/storage';
import { UserId } from '@shared/decorators/user-id.decorator';
import { ResidentsFindQueryDto } from '@app/residents/dto/residents-find-query.dto';
import { imageFileFilter } from '@utils/imageFileFilter';
import { GetResidentParamsDto } from './dto/get-resident-params.dto';
import { IResident } from './interfaces/resident.interface';
import { IResidentList } from './interfaces/resident.interface-list';
import { ResidentsService } from './residents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-access.guard';
import { IUploadAvatar } from '@app/residents/interfaces/upload-avatar.interface';
import { ResidentsBlockDto } from '@app/residents/dto/residents-block.dto';

@ApiTags('Residents')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
@Controller('residents')
export class ResidentsController {
  constructor(private residentsService: ResidentsService) {}

  /**
   * Нахождение списка резидентов
   * @param userId - идентификатор пользователя.
   * @param queryParams - параметры для поиска.
   * @returns - список резидентов.
   */
  @Get('list')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@UserId() userId: Types.ObjectId, @Query() queryParams?: ResidentsFindQueryDto): Promise<IResidentList[]> {
    return await this.residentsService.findAll(userId, queryParams);
  }

  /**
   * Нахождение резидента по параметрам
   * @param userId - идентификатор пользователя.
   * @param params - параметры для поиска.
   * @returns - список резидентов.
   */
  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Системный идентификатор резидента',
  })
  async findOneById(@UserId() userId: Types.ObjectId, @Param() params: GetResidentParamsDto): Promise<IResident> {
    return await this.residentsService.findOneById(userId, params);
  }

  /**
   * Загрузка аватарки
   * @param userId - идентификатор пользователя.
   * @param file - файл
   * @param res - response
   * @returns - список резидентов.
   */
  @Post('avatar')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileStorage,
      fileFilter: imageFileFilter,
    }),
  )
  async avatarUpload(
    @UserId() userId: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: e.Response,
  ): Promise<e.Response<IUploadAvatar>> {
    return await this.residentsService.uploadAvatar(userId, file, res);
  }

  /**
   * Смена блокировки резидента
   * @param userId - идентификатор пользователя.
   * @param dto - данные для блокировки.
   * @returns - список резидентов.
   */
  @Patch('block')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.NO_CONTENT)
  async blockResident(@UserId() userId: Types.ObjectId, @Body() dto: ResidentsBlockDto): Promise<void> {
    return this.residentsService.blockResident(userId, dto);
  }
}
