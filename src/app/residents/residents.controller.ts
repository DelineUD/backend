import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetResidentParamsDto } from './dto/get-resident-params.dto';
import { Resident } from './entities/resident.entity';
import { IResident } from './interfaces/resident.interface';
import { ResidentsService } from './residents.service';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('residents')
@Controller('residents')
export class ResidentsController {
  constructor(private residentsService: ResidentsService) {}

  @Get('list')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'список резидентов',
    type: [Resident],
  })
  @UseGuards(AuthGuard('jwt'))
  public async getList(): Promise<IResident[]> {
    const result = await this.residentsService.getResidentsList();
    return result;
  }

  @Get(':_id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'резидент по айди',
    type: Resident,
  })
  @UseGuards(AuthGuard('jwt'))
  public async getById(
    @Param() params: GetResidentParamsDto,
  ): Promise<IResident> {
    const result = await this.residentsService.getResidentById(params);
    return result;
  }
}
