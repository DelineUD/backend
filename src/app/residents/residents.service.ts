import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    const unit = await this.usersService.findOne(query).then(residentMapper);
    return unit;
  }

  async upAvatar({ authorization }: IResidentAuth, file: any) {
    const noBearer = authorization.split(' ');
    if (!authorization) throw new UnauthorizedException('Please sign in!');

    try {
      await this.jwtService.verifyAsync(noBearer[1]);
    } catch (err) {
      throw new UnauthorizedException('Invalid token or expired!');
    }

    const result = await this.jwtService.verifyAsync(noBearer[1]);
    const user = await this.usersService.findOne(result);
    const _id = user._id;
    const userInDb = await this.userModel.findOne({ _id }).exec();

    await userInDb.updateOne({
      avatar: `www.ya.ru/${file}`,
    });
    await userInDb.save();

    return user;
  }
}
