import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare, genSalt, hash } from 'bcrypt';
import { Model } from 'mongoose';
import { toUserDto } from '../shared/mapper';
import { LoginUserDto } from './dto/user-login.dto';
import { CreateUserDto } from './dto/user.create.dto';
import { UserDto } from './dto/user.dto';
import { UserModel } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
  ) {}

  async getUsers(): Promise<UserModel[]> {
    const users = await this.userModel.find({});

    return users;
  }

  async findOne(options?: object): Promise<UserDto> {
    const user = await this.userModel.findOne(options).exec();
    return toUserDto(user);
  }

  async findByLogin({ phone, password }: LoginUserDto): Promise<UserDto> {
    const user = await this.userModel.findOne({ phone }).exec();

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await compare(password, user.password);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return toUserDto(user);
  }

  async findByPayload({ phone }: any): Promise<UserDto> {
    return await this.findOne({ phone });
  }

  async create(userDto: CreateUserDto): Promise<UserDto> {
    const { phone, password, email} = userDto;

    const userInDb = await this.userModel.findOne({ phone }).exec();
    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const salt = await genSalt(10);
    const hashPassword = await hash(password, salt);

    const user: UserModel = await new this.userModel({
      phone,
      password: hashPassword,
      email,
      quality: null,
      instagram: null,
      vk: null,
      bio: null,
      city: null,
      age: null,
      price: null,
      readyToRemote: false,
      readyToWorkNow: false,
    });

    await user.save();

    return toUserDto(user);
  }


  async findByPhone({ phone }: LoginUserDto): Promise<UserDto> {
    const user = await this.userModel.findOne({ phone }).exec();

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    return toUserDto(user);
  }

  async findById(options?: object): Promise<UserDto> {
    const user = await this.userModel.findOne(options).exec();
    return toUserDto(user);
  }
}
