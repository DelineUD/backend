import { Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';

import { Types } from 'mongoose';

import { fileStorage } from '@shared/storage';
import { UserId } from '@shared/decorators/user-id.decorator';
import { imageFileFilter } from '@utils/imageFileFilter';
import { GetResidentParamsDto } from './dto/get-resident-params.dto';
import { IResident } from './interfaces/resident.interface';
import { IResidentList } from './interfaces/resident.interface-list';
import { ResidentsService } from './residents.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Residents')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
@Controller('residents')
export class ResidentsController {
  constructor(private residentsService: ResidentsService) {}

  @Get('list')
  async getList(): Promise<IResidentList[]> {
    return await this.residentsService.getResidentsList();
  }

  @Get(':_id')
  @ApiParam({
    name: '_id',
    description: 'Идентификатор резидента',
    required: true,
  })
  async getById(
    @Param()
    params: GetResidentParamsDto,
  ): Promise<IResident> {
    return await this.residentsService.getResidentById(params);
  }

  @Post('avatar')
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
  async avatarUpload(@UserId() userId: Types.ObjectId, @UploadedFile() file: Express.Multer.File): Promise<string> {
    return await this.residentsService.uploadAvatar(userId, file);
  }
}
