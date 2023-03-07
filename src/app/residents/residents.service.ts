import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { GetResidentParamsDto } from './dto/get-resident-params.dto';
import { IResident } from './interfaces/resident.interface';
import { residentListMapper, residentMapper } from './mapper';

@Injectable()
export class ResidentsService {
  constructor(private usersService: UsersService) {}

  async getResidentsList(): Promise<IResident[]> {
    return this.usersService.getUsers().then(residentListMapper);
  }

  async getResidentById(query: GetResidentParamsDto): Promise<IResident> {
    return this.usersService.findOne(query).then(residentMapper);
  }
}
