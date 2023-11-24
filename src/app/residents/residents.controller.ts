import {
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../upload/upload.service';
import { GetResidentParamsDto } from './dto/get-resident-params.dto';
import { Resident } from './entities/resident.entity';
import { ResidentList } from './entities/resident.list.entity';
import { IResidentAuth } from './interfaces/jwt.resident.auth';
import { IResident } from './interfaces/resident.interface';
import { IResidentList } from './interfaces/resident.interface-list';
import { ResidentsService } from './residents.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Residents')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
@Controller('residents')
export class ResidentsController {
  [x: string]: any;

  constructor(private residentsService: ResidentsService) {}

  @Get('list')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список резидентов',
    type: [ResidentList],
  })
  async getList(): Promise<IResidentList[]> {
    return await this.residentsService.getResidentsList();
  }

  @Get(':_id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Резидент по айди',
    type: Resident,
  })
  async getById(
    @Param()
    params: GetResidentParamsDto,
  ): Promise<IResident> {
    return await this.residentsService.getResidentById(params);
  }

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: process.env.STATIC_PATH_FOLDER,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Загрузить аватар',
    type: Resident,
  })
  async avatarUpload(
    @Headers() data: IResidentAuth,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<IResidentAuth> {
    if (file !== undefined) {
      return await this.residentsService.upAvatar(data, file.filename);
    } else {
      throw new HttpException('Нет файла!', HttpStatus.BAD_REQUEST);
    }
  }
}
