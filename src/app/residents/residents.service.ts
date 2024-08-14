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
import { ResidentsBlockDto } from '@app/residents/dto/residents-block.dto';

const logger = new Logger('Residents');

@Injectable()
export class ResidentsService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
    private readonly usersService: UsersService,
    private readonly filtersService: FiltersService,
  ) {}

  async findAll(
    userId: Types.ObjectId,
    { search, ...queryParams }: Partial<ResidentsFindQueryDto>,
  ): Promise<IResidentList[]> {
    try {
      const user = await this.usersService.findOne({ _id: userId });
      if (!user) {
        throw new EntityNotFoundError('Пользователь не найден');
      }

      const query: FilterQuery<Partial<IUser>> = await getMainFilters(this.filtersService, queryParams);

      if (search) {
        const [first, last] = [new RegExp(search.split(' ')[0], 'i'), new RegExp(search.split(' ')[1], 'i')];
        query.$or = [
          { first_name: first, last_name: last },
          { first_name: last, last_name: first },
        ];
      }

      return await this.usersService.findAll(query).then((res) =>
        residentListMapper(res, {
          _id: user._id,
          blocked_users: user.blocked_users,
        }),
      );
    } catch (err) {
      logger.error(`Error while findAll: ${(err as Error).message}`);
      throw err;
    }
  }

  async findOneById(userId: Types.ObjectId, { id }: GetResidentParamsDto): Promise<IResident> {
    try {
      const user = await this.usersService.findOne({ _id: userId });
      if (!user) {
        throw new EntityNotFoundError('Пользователь не найден');
      }

      const resident = await this.usersService.findOne({ _id: id });

      return residentMapper(resident, { _id: user._id, blocked_users: user.blocked_users });
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

  async blockResident(userId: Types.ObjectId, { residentId }: ResidentsBlockDto) {
    try {
      const blockedId = new Types.ObjectId(residentId);

      if (blockedId.equals(userId)) {
        throw new BadRequestException(`User id is equal block user id`);
      }

      const resident = await this.usersService.findOne({ _id: userId });
      if (!resident) {
        throw new EntityNotFoundError(`Пользователь не найден`);
      }

      const blockCandidate = await this.usersService.findOne({ _id: blockedId });
      if (!blockCandidate) {
        throw new EntityNotFoundError(`Пользователь не найден`);
      }

      const blockedArr = resident.blocked_users;
      const index = blockedArr.findIndex((i) => i.equals(blockedId));
      index === -1 ? blockedArr.push(blockedId) : blockedArr.splice(index, 1);

      await this.usersService.updateByPayload({ _id: resident._id }, { blocked_users: blockedArr });
    } catch (err) {
      logger.error(`Error while blockUser: ${(err as Error).message}`);
      throw err;
    }
  }
}
