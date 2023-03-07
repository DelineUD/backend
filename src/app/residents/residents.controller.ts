import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetResidentParamsDto } from './dto/get-resident-params.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { ResidentUpdate } from './entities/resident-update.entity';
import { Resident } from './entities/resident.entity';
import { IResident } from './interfaces/resident.interface';
import { ResidentsService } from './residents.service';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('residents')
@UseGuards(AuthGuard('jwt'))
@Controller('residents')
export class ResidentsController {
  constructor(private residentsService: ResidentsService) {}

  @Get('list')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'список резидентов',
    type: [Resident],
  })
  async getList(): Promise<IResident[]> {
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

  @Patch(':_id')
  @ApiBody({
    description: 'Новые данные резидента',
    type: ResidentUpdate,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Данные резидента успешно обновлены',
    type: Resident,
  })
  async updateResident(
    @Param() params: GetResidentParamsDto,
    @Body() updateResidentDto: UpdateResidentDto,
  ): Promise<IResident> {
    const result = await this.residentsService.updateResident(
      params,
      updateResidentDto,
    );

    return result;
  }
}
