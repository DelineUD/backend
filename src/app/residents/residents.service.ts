import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserModel } from '../users/models/user.model';
import { UsersService } from '../users/users.service';
import { GetResidentParamsDto } from './dto/get-resident-params.dto';
import { IResidentAuth } from './interfaces/jwt.resident.auth';
import { IResident } from './interfaces/resident.interface';
import { IResidentList } from './interfaces/resident.interface-list';
import { residentListMapper, residentMapper } from './residents.mapper';
import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';

@Injectable()
export class ResidentsService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
  ) {}

  async getResidentsList(): Promise<IResidentList[]> {
    return await this.usersService.getUsers().then(residentListMapper);
  }

  async getResidentById(query: GetResidentParamsDto): Promise<IResident> {
    try {
      const resident = await this.usersService.findOne(query);
      return residentMapper(resident);
    } catch (err) {
      throw new NotFoundException(`Пользователь не найден!`);
    }
  }

  async uploadAvatar(userId: string, file: Express.Multer.File): Promise<string> {
    try {
      if (!file) {
        throw new BadRequestException('Файл не найден!');
      }

      const resident = await this.userModel
        .findOneAndUpdate({
          _id: userId,
          avatar: file.filename,
        })
        .exec();
      if (!resident) {
        throw new EntityNotFoundError('Пользователь не найден');
      }
      console.log(file);

      return file.filename;
    } catch (err) {
      throw err;
    }
  }
}
