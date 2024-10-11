import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { FilterQuery, Types } from 'mongoose';

import { FiltersService } from '@app/filters/filters.service';
import { ProfileUpdateDto } from '@app/profiles/dto/profile-update.dto';
import { ProfilesBlockDto } from '@app/profiles/dto/profiles-block.dto';
import { ProfilesFindQueryDto } from '@app/profiles/dto/profiles-find-query.dto';
import { profileFiltersMapper } from '@app/profiles/mappers/profile-filters.mapper';
import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';
import { UserEntity } from '../users/entities/user.entity';
import { userUpdateMapper } from '../users/mappers/user-update.mapper';
import { UsersService } from '../users/users.service';
import { ProfileGetParamsDto } from './dto/profile-get-params.dto';
import { IProfileListResponse } from './interfaces/profile-list.interface';
import { IProfileResponse } from './interfaces/profile.interface';
import { profileListMapper, profileMapper } from './mappers/profile.mapper';

const logger = new Logger('Profiles');

@Injectable()
export class ProfileService {
  constructor(private readonly usersService: UsersService, private readonly filtersService: FiltersService) {}

  async update(
    userId: Types.ObjectId,
    { password, ...dto }: ProfileUpdateDto,
    avatar: Express.Multer.File,
  ): Promise<IProfileResponse> {
    try {
      const userInDb = await this.usersService.findOne({ _id: userId });
      if (!userInDb) throw new EntityNotFoundError('Пользователь не найден!');
      if (String(userInDb._id) !== String(userId)) throw new UnauthorizedException('Нет доступа!');

      let hashedPassword = userInDb.password;
      if (password) {
        hashedPassword = await hash(password, 10);
      }

      const profile = await this.usersService.updateByPayload(
        { _id: userInDb._id },
        userUpdateMapper(
          {
            ...dto,
            avatar,
            password: hashedPassword,
            is_eula_approved: userInDb.preferences?.is_eula_approved,
          },
          userInDb,
        ),
      );

      logger.log('Profile successfully updated!');

      return profileMapper(profile, { _id: profile._id, bun_info: profile?.bun_info });
    } catch (err) {
      logger.error(`Error while update: ${(err as Error).message}`);
      throw err;
    }
  }

  async findAll(
    userId: Types.ObjectId,
    { search, ...queryParams }: ProfilesFindQueryDto,
  ): Promise<IProfileListResponse> {
    try {
      const user = await this.usersService.findOne({ _id: userId });
      if (!user) {
        throw new EntityNotFoundError('Пользователь не найден');
      }

      const query: FilterQuery<Partial<UserEntity>> = await profileFiltersMapper(this.filtersService, queryParams);

      if (search) {
        const [first, last] = [new RegExp(search.split(' ')[0], 'i'), new RegExp(search.split(' ')[1], 'i')];
        query.$or = [
          { first_name: first, last_name: last },
          { first_name: last, last_name: first },
        ];
      }

      return await this.usersService.findAll(query).then((res) =>
        profileListMapper(res, {
          _id: user._id,
          bun_info: user?.bun_info,
        }),
      );
    } catch (err) {
      logger.error(`Error while findAll: ${(err as Error).message}`);
      throw err;
    }
  }

  async findOneById(userId: Types.ObjectId, { id }: ProfileGetParamsDto): Promise<IProfileResponse> {
    try {
      const user = await this.usersService.findOne({ _id: userId });
      if (!user) {
        throw new EntityNotFoundError('Пользователь не найден');
      }

      const resident = await this.usersService.findOne({ _id: new Types.ObjectId(id) });

      return profileMapper(resident, { _id: user._id, bun_info: user.bun_info });
    } catch (err) {
      logger.error(`Error while findOneById: ${(err as Error).message}`);
      throw new EntityNotFoundError(`Пользователь не найден`);
    }
  }

  async delete(userId: Types.ObjectId): Promise<void> {
    try {
      const deletedProfile = await this.usersService.deleteOne(userId);
      if (!deletedProfile) throw new EntityNotFoundError('Профиль не найден!');

      logger.log('Profile successfully deleted!');

      return;
    } catch (err) {
      logger.error(`Error while delete: ${(err as Error).message}`);
      throw err;
    }
  }

  async blockProfile(userId: Types.ObjectId, { profileId }: ProfilesBlockDto) {
    try {
      const blockedId = new Types.ObjectId(profileId);

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
