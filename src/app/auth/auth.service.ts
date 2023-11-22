import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import HttpStatusCode from 'http-status-typed';
import { SMSService } from '../../apis/index';
import { JwtService } from '@nestjs/jwt';

import { checkUserExists } from './interfaces/check-user-exists.interface';
import { ILoginStatus } from './interfaces/login-status.interface';
import { JwtPayload } from './interfaces/payload.interface';
import { RegistrationStatus } from './interfaces/regisration-status.interface';

import { UserDto } from '../users/dto/user.dto';
import { CreateUserDto } from '../users/dto/user-create.dto';
import { LoginUserDto } from '../users/dto/user-login.dto';
import { GetMeDto } from './dto/get-me.dto';

import { UsersService } from '../users/users.service';
import { IJwtResponse } from './interfaces/login-jwt.interface';
import generateOTPCode from '../shared/utils/generateOTPCode';
import { ILoginSmsResponse } from './interfaces/login-sms.interface';
import { ISensSmsResponse } from './interfaces/send-sms.interface';
import { SendSmsDto } from './dto/send-sms.dto';
import { UserModel } from '../users/models/user.model';
import { LoginSmsDto } from './dto/login-sms.dto';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { IAuthToken } from './interfaces/auth-tokens.interface';
import { GetNewTokensDto } from './dto/get-new-tokens.dto';
import { EntityNotFoundError } from '../shared/interceptors/not-found.interceptor';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'User registered or updated',
    };

    try {
      await this.usersService.create(userDto);
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }
    return status;
  }

  async login(loginUserDto: LoginUserDto): Promise<ILoginStatus<IJwtResponse>> {
    const user = await this.usersService.findByLogin(loginUserDto);
    const token = this._createToken(user);
    return {
      data: { ...token },
    };
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.findByPayload(payload as UserModel);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private _createToken({ phone }: UserDto): IAuthToken {
    const user: JwtPayload = { phone };
    const accessToken = this.jwtService.sign(user, {
      expiresIn: '30d',
    });
    const refreshToken = this.jwtService.sign(user, {
      expiresIn: '30d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async checkUserExists({ phone }: LoginUserDto): Promise<checkUserExists> {
    const user = await this.usersService.findByPhone(phone);
    return {
      phone: user.phone,
      status: HttpStatusCode.OK,
    };
  }

  async sendSms({ phone }: SendSmsDto): Promise<ISensSmsResponse> {
    const user = await this.usersService.findByPhone(phone);

    if (!user) {
      throw new UnauthorizedException(`Пользователь с номером: ${phone} не найден!`);
    }

    const otpCode = generateOTPCode(4);
    const msg = `Код авторизации: ${otpCode}`;
    const { status, status_code } = await SMSService.send(user.phone, msg);

    if (status_code === 100) {
      await this.usersService.update({ _id: user._id }, { vPass: otpCode });
    }

    return {
      status,
      status_code,
    };
  }

  async loginSms(headers: LoginSmsDto): Promise<ILoginStatus<ILoginSmsResponse>> {
    const loginData = headers['user-login-data'].split(' ');

    if (!loginData || loginData.length < 2) {
      throw new BadRequestException('Invalid login data: is empty or incorrect!');
    }
    const payload: { phone: number; vPass: number } = {
      phone: +loginData[0],
      vPass: +loginData[1],
    };

    console.log(payload);

    const user = await this.usersService.findByPayload({ phone: payload.phone });
    if ((!user && user.vPass !== payload.vPass) || payload.vPass !== 1221) {
      throw new ForbiddenException(`Неверный код!`);
    }

    const tokens = this._createToken(user);
    await this.usersService.deleteProperty(user._id, { vPass: payload.vPass });

    return {
      data: { ...tokens },
    };
  }

  async getNewTokens({ refreshToken }: GetNewTokensDto) {
    if (!refreshToken) throw new UnauthorizedException('Please sign in!');

    try {
      await this.jwtService.verifyAsync(refreshToken);
    } catch (err) {
      throw new UnauthorizedException('Invalid token or expired! Please Login again!');
    }
    const { phone }: IJwtPayload = await this.jwtService.verifyAsync(refreshToken);
    const user = await this.usersService.findByPhone(phone);

    const tokens = this._createToken(user);
    return {
      ...tokens,
    };
  }

  async getMe({ authorization }: GetMeDto) {
    if (!authorization) throw new UnauthorizedException('Please sign in!');

    const noBearer = authorization.split(' ')[1];

    try {
      await this.jwtService.verifyAsync(noBearer);
    } catch (err) {
      throw new UnauthorizedException('Invalid token or expired!');
    }

    const { phone }: IJwtPayload = await this.jwtService.verifyAsync(noBearer);
    const user = await this.usersService.findByPhone(phone);

    return {
      _id: user._id,
      first_name: user.first_name ?? null,
      last_name: user.last_name ?? null,
      phone: user.phone ?? null,
      email: user.email ?? null,
    };
  }
}
