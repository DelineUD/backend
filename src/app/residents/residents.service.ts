import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ResidentInterface } from './interfaces/resident.interface';
import { residentListMapper } from './mapper';

@Injectable()
export class ResidentsService {
  constructor(private usersService: UsersService) {}

  async getResidentsList(): Promise<ResidentInterface[]> {
    return this.usersService
      .getUsers()
      .then((response) => residentListMapper(response));
  }
}
