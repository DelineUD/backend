import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { compare } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { AuthLoginDto } from '@app/_auth/dto/auth-login.dto';
import { UserCreateDto } from '@app/_users/dto/user-create.dto';
import { createUserMapper } from '@app/_users/mappers/create-user.mapper';
import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';
import { transformPhoneNumber } from '@utils/transformPhoneNumber';
import { UserEntity } from './entities/user.entity';
import { IUser } from './interfaces/user.interface';

const logger = new Logger('Users');

@Injectable()
export class UsersService {
  constructor(@InjectModel(UserEntity.name) private readonly userModel: Model<UserEntity>) {}

  async create(dto: UserCreateDto): Promise<UserEntity> {
    try {
      return await this.userModel.create(createUserMapper(dto));
    } catch (err) {
      logger.error(`Error while create: ${(err as Error).message}`);
      throw err;
    }
  }

  async findAll(filter: FilterQuery<Partial<IUser>>): Promise<UserEntity[]> {
    try {
      return await this.userModel.find({ ...filter }).exec();
    } catch (err) {
      logger.error(`Error while findAll: s${(err as Error).message}`);
      throw new EntityNotFoundError();
    }
  }

  async findOne(where: Partial<IUser>): Promise<UserEntity> {
    try {
      return await this.userModel.findOne({ ...where }).exec();
    } catch (err) {
      logger.error(`Error while findOne: ${(err as Error).message}`);
      throw new EntityNotFoundError();
    }
  }

  async findByLogin({ phone, password }: AuthLoginDto): Promise<UserEntity> {
    try {
      const validPhone = transformPhoneNumber(phone);
      const userInDb = await this.userModel.findOne({ phone: validPhone }).exec();

      if (!userInDb) throw new EntityNotFoundError('Пользователь с этим номером не зарегистрирован.');

      const areEqual = await compare(password, userInDb.password);

      if (!areEqual) throw new BadRequestException('Неверно введен пароль.');

      return userInDb;
    } catch (err) {
      logger.error(`Error while findByLogin: ${(err as Error).message}`);
      throw err;
    }
  }

  async findByPhone(phone: string): Promise<UserEntity> {
    try {
      const validPhone = transformPhoneNumber(phone);

      return await this.userModel.findOne({ phone: validPhone }).exec();
    } catch (err) {
      logger.error(`Error while findByPhone: ${err}`);
      throw err;
    }
  }

  async deleteOne(userId: Types.ObjectId): Promise<void> {
    try {
      await this.userModel.findOneAndDelete({ _id: userId });
    } catch (err) {
      logger.error(`Error while deleteUser: ${(err as Error).message}`);
      throw err;
    }
  }
}
