import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcrypt';
import { DeleteResult } from 'mongodb';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

import { UserCreateDto } from '@/app/users/dto/user-create.dto';
import { AuthLoginDto } from '@app/auth/dto/auth-login.dto';
import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';
import { transformPhoneNumber } from '@utils/transformPhoneNumber';
import { UserEntity } from './entities/user.entity';
import { IUser, IUserQuery } from './interfaces/user.interface';
import { createUserMapper } from './mappers/create-user.mapper';

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

  async findOne(where: Partial<IUserQuery>): Promise<UserEntity> {
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
      return await this.userModel.findOne({ phone }).exec();
    } catch (err) {
      logger.error(`Error while findByPhone: ${err}`);
      throw err;
    }
  }

  async deleteOne(userId: Types.ObjectId): Promise<DeleteResult> {
    try {
      return await this.userModel.findOneAndDelete({ _id: userId });
    } catch (err) {
      logger.error(`Error while deleteUser: ${(err as Error).message}`);
      throw err;
    }
  }

  async updateByPayload(where: FilterQuery<UserEntity>, payload: UpdateQuery<UserEntity>): Promise<UserEntity> {
    try {
      const updatedUser = await this.userModel.findOneAndUpdate(where, payload, { new: true });

      if (!updatedUser) {
        throw new EntityNotFoundError('Пользователь не найден');
      }

      return updatedUser;
    } catch (err) {
      logger.error(`Error while updateByPayload: ${(err as Error).message}`);
      throw err;
    }
  }
}
