import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import e from 'express';
import { FilterQuery, Model, Types } from 'mongoose';

import { FiltersService } from '@app/filters/filters.service';
import { ResidentsBlockDto } from '@app/residents/dto/residents-block.dto';
import { ResidentsFindQueryDto } from '@app/residents/dto/residents-find-query.dto';
import { IUploadAvatar } from '@app/residents/interfaces/upload-avatar.interface';
import { getMainFilters } from '@helpers/getMainFilters';
import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { GetResidentParamsDto } from './dto/get-resident-params.dto';
import { IResident } from './interfaces/resident.interface';
import { IResidentList } from './interfaces/resident.interface-list';
import { residentListMapper, residentMapper } from './residents.mapper';

const logger = new Logger('Residents');

@Injectable()
export class ResidentsService {
  constructor(
    @InjectModel(UserEntity.name)
    private readonly userModel: Model<UserEntity>,
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

      const query: FilterQuery<Partial<UserEntity>> = await getMainFilters(this.filtersService, queryParams);

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
          bun_info: user.bun_info,
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

      return residentMapper(resident, { _id: user._id, bun_info: user.bun_info });
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

      const blockedArr = resident.bun_info;
      const index = blockedArr.blocked_users?.findIndex((i) => i.equals(blockedId));
      index === -1 ? blockedArr?.blocked_users?.push(blockedId) : blockedArr?.blocked_users?.splice(index, 1);

      await this.usersService.updateByPayload({ _id: resident._id }, { bun_info: blockedArr });
    } catch (err) {
      logger.error(`Error while blockUser: ${(err as Error).message}`);
      throw err;
    }
  }
}
