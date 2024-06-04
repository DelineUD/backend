import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { compare } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { AuthLoginDto } from '@app/_auth/dto/auth-login.dto';
import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';
import { transformPhoneNumber } from '@utils/transformPhoneNumber';
import { UserEntity } from './entities/user.entity';
import { IUser } from './interfaces/user.interface';

const logger = new Logger('Users');

@Injectable()
export class UsersService {
  constructor(@InjectModel(UserEntity.name) private readonly userModel: Model<UserEntity>) {}

  async findAll(filter: FilterQuery<Partial<IUser>>): Promise<IUser[]> {
    try {
      return this.userModel.find({ ...filter }).exec();
    } catch (err) {
      logger.error(`Error while findAll: ${(err as Error).message}`);
      throw new EntityNotFoundError(err);
    }
  }

  async findOne(where: Partial<IUser>): Promise<UserEntity> {
    try {
      return await this.userModel.findOne({ ...where }).exec();
    } catch (err) {
      logger.error(`Error while findOne: ${(err as Error).message}`);
      throw err;
    }
  }

  async findByLogin({ phone, password }: AuthLoginDto): Promise<IUser> {
    try {
      const validPhone = transformPhoneNumber(phone);
      const useInDb = await this.userModel.findOne({ phone: validPhone }).exec();

      if (!useInDb) throw new EntityNotFoundError(`Пользователь с телефоном ${validPhone} не найден`);

      const areEqual = await compare(password, useInDb.password);

      if (!areEqual) {
        throw new BadRequestException('Неверный пароль!');
      }

      return useInDb;
    } catch (err) {
      logger.error(`Error while findByLogin: ${(err as Error).message}`);
      throw err;
    }
  }

  async findByPhone(phone: string): Promise<IUser> {
    try {
      const validPhone = transformPhoneNumber(phone);
      const useInDb = await this.userModel.findOne({ phone: validPhone }).exec();

      if (!useInDb) throw new EntityNotFoundError(`Пользователь не найден`);

      return useInDb;
    } catch (err) {
      logger.error(`Error while findByPhone: ${err}`);
      throw err;
    }
  }

  async updateByPayload(where: Partial<IUser>, payload: Partial<IUser>): Promise<IUser> {
    try {
      const updatedUser = await this.userModel.findOneAndUpdate({ ...where }, { ...payload }, { new: true });

      if (!updatedUser) throw new EntityNotFoundError('Пользователь не найден');

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

  async deleteProperty(userId: Types.ObjectId | string, prop: object): Promise<void> {
    try {
      const result = await this.userModel.updateOne({ _id: userId }, { $unset: prop });

      if (!result) throw new EntityNotFoundError(`Не найдено`);

      return;
    } catch (err) {
      logger.error(`Error while deleteProperty: ${(err as Error).message}`);
      throw err;
    }
  }
}
