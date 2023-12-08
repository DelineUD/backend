import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { UserModel } from './models/user.model';

import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';
import { IUser } from '@app/users/interfaces/user.interface';
import { userMapper } from '@app/users/users.mapper';
import { FiltersService } from '@app/filters/filters.service';

import { LoginUserDto } from './dto/user-login.dto';
import { CreateUserDto } from './dto/user-create.dto';
import { UpdateFiltersDto } from '@app/filters/dto/update-filters.dto';
import { filterQueries } from '@helpers/filterQueries';
import { FilterKeys } from '@app/filters/consts';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
    private readonly filtersService: FiltersService,
  ) {}

  async findAll(filter: FilterQuery<Partial<IUser>>): Promise<IUser[]> {
    try {
      return this.userModel.find({ ...filter }).exec();
    } catch (err) {
      throw new EntityNotFoundError(err);
    }
  }

  async findOne(where: Partial<IUser>): Promise<UserModel> {
    try {
      return await this.userModel.findOne({ ...where }).exec();
    } catch (e) {
      throw new EntityNotFoundError(e);
    }
  }

  async findByLogin({ phone, password }: LoginUserDto): Promise<IUser> {
    const user = await this.userModel.findOne({ phone }).exec();

    if (!user) {
      throw new EntityNotFoundError(`Пользователь с телефоном ${phone} не найден!`);
    }

    const areEqual = await compare(password, user.password);

    if (!areEqual) {
      throw new HttpException('Неверные учетные данные!', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  async findByPayload(payload: object): Promise<IUser> {
    return await this.findOne(payload);
  }

  async createOrUpdate(createUserDto: CreateUserDto): Promise<IUser> {
    try {
      const { phone } = createUserDto;

      const salt = await genSalt(10);
      const hashPassword = await hash(createUserDto.password, salt);
      const userMapped = userMapper(createUserDto);
      const updateFilters: UpdateFiltersDto = {
        [FilterKeys.Country]: userMapped.country,
        [FilterKeys.City]: userMapped.city,
        [FilterKeys.Spec]: userMapped.specializations,
        [FilterKeys.NarrowSpec]: userMapped.narrow_specializations,
        [FilterKeys.Programs]: userMapped.programs,
        [FilterKeys.Courses]: userMapped.courses,
      };

      const user = await this.userModel.findOne({ phone });

      if (!user) {
        return await this.userModel.create({ ...userMapped, password: hashPassword });
      }

      this.filtersService.update(updateFilters).then(() => console.log('Filters updated!'));

      return await user.updateOne({ ...userMapped, password: hashPassword }).exec();
    } catch (err) {
      throw err;
    }
  }

  async findByPhone(phone: number): Promise<IUser> {
    const user = await this.userModel.findOne({ phone }).exec();

    if (!user) {
      throw new EntityNotFoundError(`Пользователь с телефоном ${phone} не найден!`);
    }

    return user;
  }

  async update(where, newData): Promise<UserModel> {
    let user: UserModel;

    try {
      user = await this.userModel.findOneAndUpdate(where, newData, {
        new: true,
      });
    } catch (e) {
      throw new EntityNotFoundError(e);
    }

    return user;
  }

  async deleteProperty(userId: Types.ObjectId | string, prop: object) {
    try {
      const result = await this.userModel.updateOne({ _id: userId }, { $unset: prop });

      if (!result) {
        throw new Error(`Пользователь не найден!`);
      }

      return true;
    } catch (err) {
      throw new Error(`Ошибка при удалении: ${err.message}!`);
    }
  }
}
