import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from '../users/models/user.model';
import { UsersService } from '../users/users.service';
import { GetResidentParamsDto } from './dto/get-resident-params.dto';
import { IResidentAuth } from './interfaces/jwt.resident.auth';
import { IResident } from './interfaces/resident.interface';
import { IResidentList } from './interfaces/resident.interface-list';
import { residentListMapper, residentMapper } from './mapper';

@Injectable()
export class ResidentsService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
  ) {}

  async getResidentsList(): Promise<IResidentList[]> {
    return await this.usersService.getUsers().then(residentListMapper);
  }

  async getResidentById(query: GetResidentParamsDto): Promise<IResident> {
    try {
      const resident = await this.usersService.findOne(query);
      return residentMapper(resident);
    } catch (err) {
      throw new NotFoundException(`Пользователь ${query._id} не найден!`);
    }
  }

  async upAvatar({ authorization }: IResidentAuth, file: string) {
    const noBearer = authorization.split(' ');
    if (!authorization) throw new UnauthorizedException('Пожалуйста авторизйтесь!');

    try {
      await this.jwtService.verifyAsync(noBearer[1]);
    } catch (err) {
      throw new UnauthorizedException('Неверный токен или срок его действия истек!');
    }

    const result = await this.jwtService.verifyAsync(noBearer[1]);
    const { _id } = await this.usersService.findOne(result);

    if (!_id) {
      throw new NotFoundException(`Пользователь ${_id} не найден!`);
    }

    const userInDb = await this.userModel.findOne({ _id }).exec();

    await userInDb.updateOne({
      avatar: `${process.env.TEST_STAND}/${file}`,
    });
    await userInDb.save();
    return await this.userModel.findOne({ _id }).exec();
  }
}
