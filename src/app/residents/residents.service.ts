import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { UserModel } from '../users/models/user.model';
import { UsersService } from '../users/users.service';
import { GetResidentParamsDto } from './dto/get-resident-params.dto';
import { IResident } from './interfaces/resident.interface';
import { IResidentList } from './interfaces/resident.interface-list';
import { residentListMapper, residentMapper } from './residents.mapper';
import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';
import { ResidentsFindQueryDto } from '@app/residents/dto/residents-find-query.dto';
import { filterQueries } from '@helpers/filterQueries';
import { splitDtoField } from '@helpers/splitDto';

@Injectable()
export class ResidentsService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
  ) {}

  async getResidentsList(queryParams?: ResidentsFindQueryDto): Promise<IResidentList[]> {
    try {
      const query = {
        country: queryParams.country ?? '',
        city: queryParams.city ?? '',
        status: queryParams.status ?? '',
        specialization_new_app: splitDtoField(queryParams.specialization),
        narrow_spec_new_app: splitDtoField(queryParams.narrow_specialization),
        programs_new_app: splitDtoField(queryParams.programs),
        courses_new_app: splitDtoField(queryParams.courses),
      };
      return await this.usersService.findAll(filterQueries(query)).then(residentListMapper);
    } catch (err) {
      throw new EntityNotFoundError('Пользователи не найдены');
    }
  }

  async getResidentById(query: GetResidentParamsDto): Promise<IResident> {
    try {
      const resident = await this.usersService.findOne(query);
      return residentMapper(resident);
    } catch (err) {
      throw new EntityNotFoundError(`Пользователь не найден`);
    }
  }

  async uploadAvatar(userId: Types.ObjectId, file: Express.Multer.File): Promise<string> {
    try {
      if (!file) {
        throw new BadRequestException('Файл не найден!');
      }

      const pathToImage = `${process.env.SERVER_URL}/${process.env.STATIC_PATH}/${file.filename}`;
      const resident = await this.userModel
        .findOneAndUpdate({
          _id: userId,
          avatar: pathToImage,
        })
        .exec();
      if (!resident) {
        throw new EntityNotFoundError('Пользователь не найден');
      }
      console.log(file);

      return pathToImage;
    } catch (err) {
      throw err;
    }
  }
}
