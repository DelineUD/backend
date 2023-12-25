import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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
import { filterQueries } from '@helpers/filterQueries';
import { transformPhoneNumber } from '@helpers/transformPhoneNumber';

const logger = new Logger('Users');

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
      logger.error(`Error while findAll: ${err}`);
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
      logger.error(`Error while findOne: ${(err as Error).message}`);
      throw err;
    }
  }

  async findByLogin({ phone, password }: LoginUserDto): Promise<IUser> {
    try {
      const user = await this.userModel.findOne({ phone: transformPhoneNumber(phone) }).exec();

      if (!user) {
        throw new EntityNotFoundError(`Пользователь с телефоном ${phone} не найден`);
      }

      const areEqual = await compare(password, user.password);

      if (!areEqual) {
        throw new BadRequestException('Неверные учетные данные!');
      }

      return user;
    } catch (err) {
      logger.error(`Error while findByLogin: ${(err as Error).message}`);
      throw err;
    }
  }

  async createOrUpdate(createUserDto: CreateUserDto): Promise<RegistrationStatus> {
    try {
      const { password, ...restUserDto } = createUserDto;

      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);
      const userMapped = userMapper(filterQueries(restUserDto) as CreateUserDto);
      const updateFilters: UpdateFiltersDto = {
        [FilterKeys.Country]: userMapped.country,
        [FilterKeys.City]: userMapped.city,
        [FilterKeys.Spec]: userMapped.specializations,
        [FilterKeys.NarrowSpec]: userMapped.narrow_specializations,
        [FilterKeys.Programs]: userMapped.programs,
        [FilterKeys.Courses]: userMapped.courses,
      };

      const user = await this.userModel.findOne({ phone: userMapped.phone });
      this.filtersService.update(updateFilters).then(() => logger.log('Fillers updated!'));

      if (!user) {
        await this.userModel.create({ ...userMapped, password: hashPassword });
        logger.log('User successfully registered!');
        return {
          status: true,
          message: 'Пользователь успешно зарегистрирован!',
        };
      }

      await user.updateOne({ ...userMapped, password: hashPassword }).exec();
      logger.log('User successfully updated!');

      return {
        status: true,
        message: 'Пользователь успешно обновлен!',
      };
    } catch (err) {
      logger.error(`Error while createUser: ${(err as Error).message}`);
      throw err;
    }
  }

  async findByPhone(phone: string): Promise<IUser> {
    try {
      const user = await this.userModel.findOne({ phone }).exec();

      if (!user) {
        throw new EntityNotFoundError(`Пользователь с телефоном ${phone} не найден`);
      }

      return user;
    } catch (err) {
      logger.error(`Error while findByPhone: ${err}`);
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
      logger.error(`Error while updateByPayload: ${(err as Error).message}`);
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
      logger.error(`Error while deleteProperty: ${(err as Error).message}`);
      throw err;
    }
  }
}
