import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';

import { UsersService } from '../users/users.service';

import { ILoginResponse } from './interfaces/login.interface';
import { JwtPayload } from './interfaces/payload.interface';
import { RegistrationStatus } from './interfaces/regisration-status.interface';
import { ISensSmsResponse } from './interfaces/send-sms.interface';
import { IJwtPayload } from './interfaces/jwt.interface';
import { IAuthTokens } from './interfaces/auth-tokens.interface';
import { IUser } from '../users/interfaces/user.interface';

import { CreateUserDto } from '../users/dto/user-create.dto';
import { LoginUserDto } from '../users/dto/user-login.dto';
import { GetMeDto } from './dto/get-me.dto';
import { LoginSmsDto } from './dto/login-sms.dto';
import { SendSmsDto } from './dto/send-sms.dto';

import generateOTPCode from '../shared/utils/generateOTPCode';
import { SmsService } from '@shared/services/sms.service';
import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
  ) {}

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    try {
      let status: RegistrationStatus = {
        success: true,
        message: 'Регистрация пройдена успешно!',
      };
      const user = await this.usersService.createOrUpdate(userDto);
      if (!user) {
        status = {
          success: false,
          message: 'Ошибка при регистрации!',
        };
      }
      return status;
    } catch (err) {
      throw err;
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<ILoginResponse> {
    const user = await this.usersService.findByLogin(loginUserDto);
    const tokens = await this._createTokens({ phone: user.phone });
    return {
      ...tokens,
    };
  }

  async validateUser(payload: JwtPayload): Promise<IUser> {
    const user = await this.usersService.findByPayload(payload);
    if (!user) {
      throw new EntityNotFoundError('Пользователь не найден');
    }
    return user;
  }

  private async _createTokens(payload: { phone: number }): Promise<IAuthTokens> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('A_EXPIRES_IN'),
        }),
        this.jwtService.signAsync(payload, {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('R_EXPIRES_IN'),
        }),
      ]);

      return {
        accessToken,
        refreshToken,
      };
    } catch (err) {
      throw err;
    }
  }

  async sendSms({ phone }: SendSmsDto): Promise<ISensSmsResponse> {
    const user = await this.usersService.findByPhone(phone);

    if (!user) {
      throw new UnauthorizedException(`Пользователь с номером: ${phone} не найден!`);
    }

    const otpCode = generateOTPCode(4);
    const msg = `Код авторизации: ${otpCode}`;
    const { status, status_code } = await this.smsService.send(user.phone, msg);

    if (status_code === 100) {
      await this.usersService.update({ _id: user._id }, { vPass: otpCode });
    }

    return {
      status,
      status_code,
    };
  }

  async loginSms(headers: LoginSmsDto): Promise<ILoginResponse> {
    const loginData = headers['user-login-data'].split(' ');

    if (!loginData || loginData.length < 2) {
      throw new BadRequestException('Неверные данные для входа: пусто или неверно!');
    }
    const payload: {
      phone: number;
      vPass: number;
    } = {
      phone: +loginData[0],
      vPass: +loginData[1],
    };

    const user = await this.usersService.findByPayload({ phone: payload.phone });
    if ((!user && user.vPass !== payload.vPass) || payload.vPass !== Number(process.env.QUICK_CODE)) {
      throw new ForbiddenException(`Неверный код!`);
    }

    const tokens = await this._createTokens({ phone: user.phone });
    await this.usersService.deleteProperty(user._id, { vPass: payload.vPass });

    return {
      ...tokens,
    };
  }

  async refresh(req: Request): Promise<IAuthTokens> {
    try {
      const user: Partial<IUser> = req.user;
      const refreshToken = req['refreshToken'];

      const tokens = await this._createTokens({ phone: user.phone });

      return {
        ...tokens,
      };
    } catch (err) {
      throw err;
    }
  }

  async getMe({ authorization }: GetMeDto): Promise<Partial<IUser>> {
    try {
      if (!authorization) {
        throw new UnauthorizedException('Токен не найден!');
      }

      const token = authorization.split(' ')[1];

      const userData: IJwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
      if (!userData) {
        throw new UnauthorizedException('Невалидный токен или срок его действия истек!');
      }

      const user = await this.usersService.findByPhone(userData.phone);

      return {
        _id: user._id,
        first_name: user.first_name ?? null,
        last_name: user.last_name ?? null,
        phone: user.phone ?? null,
        email: user.email ?? null,
      };
    } catch (err) {
      throw err;
    }
  }
}
