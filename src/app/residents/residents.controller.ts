import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResidentsService } from './residents.service';

@Controller('residents')
export class ResidentsController {
  constructor(private residentsService: ResidentsService) {}

  @Get('list')
  @UseGuards(AuthGuard('jwt'))
  public async gettList(): Promise<any> {
    const result = await this.residentsService.getResidentsList();
    return result;
  }
}
