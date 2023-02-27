import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Resident } from './entities/resident.entity';
import { ResidentInterface } from './interfaces/resident.interface';
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
  public async gettList(): Promise<ResidentInterface[]> {
    const result = await this.residentsService.getResidentsList();
    return result;
  }
}
