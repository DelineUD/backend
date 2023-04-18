import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { GetResidentParamsDto } from './dto/get-resident-params.dto';
import { IResident } from './interfaces/resident.interface';
import { IResidentList } from './interfaces/resident.interface-list';
import { residentListMapper, residentMapper } from './mapper';

@Injectable()
export class ResidentsService {
  constructor(private usersService: UsersService) {}

  async getResidentsList(): Promise<IResidentList[]> {
    return await this.usersService.getUsers().then(residentListMapper);
  }

  async getResidentById(query: GetResidentParamsDto): Promise<IResident> {
    const unit = await this.usersService.findOne(query).then(residentMapper);
    return unit;
  }
}
