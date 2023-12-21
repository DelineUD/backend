import { BadRequestException, Injectable } from '@nestjs/common';
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
import { FilterKeys } from '@app/filters/consts';
import { RegistrationStatus } from '@app/auth/interfaces/regisration-status.interface';

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
      const user = await this.userModel.findOne({ ...where }).exec();
      if (!user) {
        throw new EntityNotFoundError('Пользователь не найден');
      }
      return user;
    } catch (err) {
      throw err;
    }
  }

  async findByLogin({ phone, password }: LoginUserDto): Promise<IUser> {
    try {
      const user = await this.userModel.findOne({ phone }).exec();

      if (!user) {
        throw new EntityNotFoundError(`Пользователь с телефоном ${phone} не найден`);
      }

      const areEqual = await compare(password, user.password);

      if (!areEqual) {
        throw new BadRequestException('Неверные учетные данные!');
      }

      return user;
    } catch (err) {
      throw err;
    }
  }

  async createOrUpdate(createUserDto: CreateUserDto): Promise<RegistrationStatus> {
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
        await this.userModel.create({ ...userMapped, password: hashPassword });
        return {
          status: true,
          message: 'Пользователь успешно зарегистрирован!',
        };
      }

      this.filtersService.update(updateFilters).then(() => console.log('Filters updated!'));
      await user.updateOne({ _id: user._id }, { ...userMapped, password: hashPassword }).exec();

      return {
        status: true,
        message: 'Пользователь успешно обновлен!',
      };
    } catch (err) {
      throw err;
    }
  }

  async findByPhone(phone: number): Promise<IUser> {
    try {
      const user = await this.userModel.findOne({ phone }).exec();

      if (!user) {
        throw new EntityNotFoundError(`Пользователь с телефоном ${phone} не найден`);
      }

      return user;
    } catch (err) {
      throw err;
    }
  }

  async updateByPayload(where: Partial<IUser>, payload: Partial<IUser>): Promise<IUser> {
    try {
      const updatedUser = await this.userModel.findOneAndUpdate({ ...where }, { ...payload }, { new: true });

      if (!updatedUser) {
        throw new EntityNotFoundError('Пользователь не найден');
      }

      return updatedUser;
    } catch (err) {
      throw err;
    }
  }

  async deleteProperty(userId: Types.ObjectId | string, prop: object) {
    try {
      const result = await this.userModel.updateOne({ _id: userId }, { $unset: prop });

      if (!result) {
        throw new EntityNotFoundError(`Не найдено`);
      }

      return true;
    } catch (err) {
      throw err;
    }
  }
}
