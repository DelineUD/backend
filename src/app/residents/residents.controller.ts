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
import { AuthGuard } from '@nestjs/passport';
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

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('residents')
@UseGuards(AuthGuard('jwt'))
@Controller('residents')
export class ResidentsController {
  [x: string]: any;
  constructor(private residentsService: ResidentsService) {}

  @Get('list')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'список резидентов',
    type: [ResidentList],
  })
  async getList(): Promise<IResidentList[]> {
    const result = await this.residentsService.getResidentsList();
    return result;
  }

  @Get(':_id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'резидент по айди',
    type: Resident,
  })
  async getById(@Param() params: GetResidentParamsDto): Promise<IResident> {
    const result = await this.residentsService.getResidentById(params);
    return result;
  }

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async avatarUpload(
    @Headers() data: IResidentAuth,
    @UploadedFile() file: any,
  ): Promise<IResidentAuth> {
    let result: any;
    if (file != undefined) {
      result = await this.residentsService.upAvatar(data, file.filename);
    } else {
      throw new HttpException('no file', HttpStatus.BAD_REQUEST);
    }

    return result;
  }
}
