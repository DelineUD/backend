import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import e from 'express';

import { UserModel } from '../users/models/user.model';
import { UsersService } from '../users/users.service';
import { GetResidentParamsDto } from './dto/get-resident-params.dto';
import { IResident } from './interfaces/resident.interface';
import { IResidentList } from './interfaces/resident.interface-list';
import { residentListMapper, residentMapper } from './residents.mapper';
import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';
import { ResidentsFindQueryDto } from '@app/residents/dto/residents-find-query.dto';
import { FiltersService } from '@app/filters/filters.service';
import { IUser } from '@app/users/interfaces/user.interface';
import { StatusFilterKeys } from '@app/filters/consts';
import { getMainFilters } from '@helpers/getMainFilters';
import { IUploadAvatar } from '@app/residents/interfaces/upload-avatar.interface';

const logger = new Logger('Residents');

@Injectable()
export class ResidentsService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
    private readonly usersService: UsersService,
    private readonly filtersService: FiltersService,
  ) {}

  async findAll({ status, ...queryParams }: Partial<ResidentsFindQueryDto>): Promise<IResidentList[]> {
    try {
      const query: FilterQuery<Partial<IUser>> = await getMainFilters(this.filtersService, queryParams);
      status && (query.status = StatusFilterKeys[query.status]);

      return await this.usersService.findAll(query).then(residentListMapper);
    } catch (err) {
      logger.error(`Error while findAll: ${(err as Error).message}`);
      throw err;
    }
  }

  async findOneById({ id }: GetResidentParamsDto): Promise<IResident> {
    try {
      const resident = await this.usersService.findOne({ _id: id });
      return residentMapper(resident);
    } catch (err) {
      logger.error(`Error while findOneById: ${(err as Error).message}`);
      throw new EntityNotFoundError(`Пользователь не найден`);
    }
  }

  async uploadAvatar(
    userId: Types.ObjectId,
    file: Express.Multer.File,
    res: e.Response,
  ): Promise<e.Response<IUploadAvatar>> {
    try {
      if (!file) {
        throw new BadRequestException('Файл не найден!');
      }

      const pathToImage = `${process.env.SERVER_URL}/${process.env.STATIC_PATH}/${file.filename}`;
      const resident = await this.userModel.findByIdAndUpdate(userId, { $set: { avatar: pathToImage } });
      if (!resident) {
        throw new EntityNotFoundError('Пользователь не найден');
      }

      logger.log('Avatar successfully loaded!');

      return res.status(200).json({ message: 'Аватарка успешно обновлена!' });
    } catch (err) {
      logger.error(`Error while uploadAvatar: ${(err as Error).message}`);
      return res.status(err.status).json({ message: 'Произошла непредвиденная ошибка!' });
    }
  }
}
