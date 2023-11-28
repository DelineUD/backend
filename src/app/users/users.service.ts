import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { UserModel } from './models/user.model';

import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';

import { toUserDto } from '@shared/mapper';

import { LoginUserDto } from './dto/user-login.dto';
import { CreateUserDto } from './dto/user-create.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
  ) {}

  async getUsers(): Promise<UserModel[]> {
    return await this.userModel.find({});
  }

  async findOne(where): Promise<UserModel> {
    try {
      return await this.userModel.findOne(where).exec();
    } catch (e) {
      throw new EntityNotFoundError(e);
    }
  }

  async findByLogin({ phone, password }: LoginUserDto): Promise<UserDto> {
    const user = await this.userModel.findOne({ phone }).exec();

    if (!user) {
      throw new EntityNotFoundError(`Пользователь с телефоном ${phone} не найден!`);
    }

    const areEqual = await compare(password, user.password);

    if (!areEqual) {
      throw new HttpException('Неверные учетные данные!', HttpStatus.BAD_REQUEST);
    }

    return toUserDto(user);
  }

  async findByPayload(payload: object): Promise<UserDto> {
    return await this.findOne(payload);
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const salt = await genSalt(10);
    const hashPassword = await hash(createUserDto.password, salt);
    const phone = createUserDto.phone;

    let user = await this.userModel.findOne({ phone }).exec();

    if (!user) {
      user = new this.userModel({
        ...createUserDto,
        phone,
        password: hashPassword,
      });
    } else {
      user.updateOne({
        ...createUserDto,
        password: hashPassword,
      });
    }

    await user.save();
    return toUserDto(user);
  }

  async findByPhone(phone: number): Promise<UserDto> {
    const user = await this.userModel.findOne({ phone }).exec();

    if (!user) {
      throw new EntityNotFoundError(`Пользователь с телефоном ${phone} не найден!`);
    }

    return toUserDto(user);
  }

  async findById(where): Promise<UserModel> {
    return await this.userModel.findOne(where).exec();
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

  async updateUsr(data?: object): Promise<UserDto> {
    const user = await this.userModel.findOne(data).exec();
    return toUserDto(user);
  }

  async deleteProperty(userId: Types.ObjectId | string, prop: object) {
    try {
      const result = await this.userModel.updateOne({ _id: userId }, { $unset: prop });

      if (!result) {
        throw new Error(`Пользователь с id: ${userId} не найден!`);
      }

      return true;
    } catch (err) {
      throw new Error(`Ошибка при удалении: ${err.message}!`);
    }
  }
}
