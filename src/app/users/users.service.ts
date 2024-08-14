import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { IUser } from '@app/users/interfaces/user.interface';
import { PostsService } from '@app/posts/posts.service';
import { ResumesService } from '@app/resumes/resumes.service';
import { VacancyService } from '@app/vacancy/vacancy.service';
import { userMapper } from '@app/users/users.mapper';
import { UpdateFiltersDto } from '@app/filters/dto/update-filters.dto';
import { FilterKeys } from '@app/filters/consts';
import { RegistrationStatus } from '@app/auth/interfaces/regisration-status.interface';
import { FiltersService } from '@app/filters/filters.service';
import { transformPhoneNumber } from '@utils/transformPhoneNumber';
import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';
import { UserModel } from './models/user.model';
import { LoginUserDto } from './dto/user-login.dto';
import { CreateUserDto } from './dto/user-create.dto';

const logger = new Logger('Users');

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
    private readonly filtersService: FiltersService,
    private readonly postsService: PostsService,
    @Inject(forwardRef(() => ResumesService)) private readonly resumesService: ResumesService,
    @Inject(forwardRef(() => VacancyService)) private readonly vacanciesService: VacancyService,
  ) {}

  async findAll(filter: FilterQuery<Partial<IUser>>): Promise<IUser[]> {
    try {
      return this.userModel.find({ ...filter }).exec();
    } catch (err) {
      logger.error(`Error while findAll: ${(err as Error).message}`);
      throw new EntityNotFoundError(err);
    }
  }

  async findOne(where: Partial<IUser>): Promise<UserModel> {
    try {
      return await this.userModel.findOne({ ...where }).exec();
    } catch (err) {
      logger.error(`Error while findOne: ${(err as Error).message}`);
      throw err;
    }
  }

  async findByLogin({ phone, password }: LoginUserDto): Promise<IUser> {
    try {
      const validPhone = transformPhoneNumber(phone);
      const user = await this.userModel.findOne({ phone: validPhone }).exec();

      if (!user) {
        throw new EntityNotFoundError(`Пользователь с телефоном ${validPhone} не найден`);
      }

      const areEqual = await compare(password, user.password);

      if (!areEqual) {
        throw new BadRequestException('Неверный пароль!');
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
      const userMapped = userMapper(restUserDto);
      const updateFilters: UpdateFiltersDto = {
        [FilterKeys.City]: userMapped.city,
        [FilterKeys.Spec]: userMapped.specializations,
        [FilterKeys.Programs]: userMapped.programs,
      };

      const userInDb = await this.userModel.findOne({ phone: userMapped.phone });
      this.filtersService.update(updateFilters).then(() => logger.log('Fillers successfully updated!'));

      if (!userInDb) {
        await this.userModel.create({ ...userMapped, password: hashPassword });
        logger.log('User successfully registered!');
        return {
          status: true,
          message: 'Пользователь успешно зарегистрирован!',
        };
      }

      await userInDb.updateOne({ ...userMapped, password: hashPassword }).exec();
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
      const validPhone = transformPhoneNumber(phone);
      const user = await this.userModel.findOne({ phone: validPhone }).exec();

      if (!user) {
        throw new EntityNotFoundError(`Пользователь с телефоном ${validPhone} не найден`);
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

  async deleteUser(userId: Types.ObjectId): Promise<void> {
    try {
      await this.userModel.findOneAndDelete({ _id: userId });
    } catch (err) {
      logger.error(`Error while deleteUser: ${(err as Error).message}`);
      throw err;
    }
  }

  async deleteUserPosts(userId: Types.ObjectId): Promise<void> {
    try {
      await this.postsService.deleteAll(userId, {});
    } catch (err) {
      logger.error(`Error while deleteUserPosts: ${(err as Error).message}`);
      throw err;
    }
  }

  async deleteUserResumes(userId: Types.ObjectId): Promise<void> {
    try {
      await this.resumesService.deleteAll(userId, {});
    } catch (err) {
      logger.error(`Error while deleteUserResumes: ${(err as Error).message}`);
      throw err;
    }
  }

  async deleteUserVacancies(userId: Types.ObjectId): Promise<void> {
    try {
      await this.vacanciesService.deleteAll(userId, {});
    } catch (err) {
      logger.error(`Error while deleteUserVacancies: ${(err as Error).message}`);
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
