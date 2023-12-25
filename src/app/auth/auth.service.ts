import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { UsersService } from '../users/users.service';

import { ILoginResponse, ILoginSmsPayload } from './interfaces/login.interface';
import { RegistrationStatus } from './interfaces/regisration-status.interface';
import { ISensSmsResponse } from './interfaces/send-sms.interface';
import { IJwtRefreshValidPayload } from './interfaces/jwt.interface';
import { IAuthTokens } from './interfaces/auth-tokens.interface';
import { IUser } from '../users/interfaces/user.interface';

import { LoginUserDto } from '../users/dto/user-login.dto';
import { LoginSmsDto } from './dto/login-sms.dto';
import { SendSmsDto } from './dto/send-sms.dto';

import generateOTPCode from '../shared/utils/generateOTPCode';
import { SmsService } from '@shared/services/sms.service';
import { TokensService } from './services/tokens.service';
import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';
import { UserDto } from '@app/users/dto/user.dto';
import { CreateUserDto } from '@app/users/dto/user-create.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly smsService: SmsService,
  ) {}

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    try {
      const user = await this.usersService.createOrUpdate(userDto);
      if (!user) {
        return { status: false, message: 'Ошибка при регистрации или обновлении пользователя!' };
      }

      return user;
    } catch (err) {
      throw err;
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<ILoginResponse> {
    const user = await this.usersService.findByLogin(loginUserDto);

    const tokens = await this.tokensService.generateTokens({ _id: user._id, phone: user.phone, email: user.email });
    await this.tokensService.updateRefreshToken(user._id, tokens.refreshToken);

    return {
      ...tokens,
      type: 'password',
    };
  }

  async sendSms({ phone }: SendSmsDto): Promise<ISensSmsResponse> {
    try {
      const user = await this.usersService.findByPhone(phone);

      if (!user) {
        throw new UnauthorizedException(`Пользователь с номером: ${phone} не найден!`);
      }

      const otpCode = generateOTPCode(4);
      const msg = `Код авторизации: ${otpCode}`;
      const { status, status_code } = await this.smsService.send(user.phone, msg);
      if (status_code === 100) {
        await this.usersService.updateByPayload({ _id: user._id }, { vPass: otpCode });
      }

      return {
        status,
        status_code,
      };
    } catch (err) {
      throw err;
    }
  }

  async loginSms(headers: LoginSmsDto): Promise<ILoginResponse> {
    try {
      const loginData = headers['user-login-data'].split(' ');

      if (!loginData || loginData.length < 2) {
        throw new BadRequestException('Неверные данные для входа: пусто или неверно!');
      }
      const payload: ILoginSmsPayload = {
        phone: loginData[0],
        vPass: +loginData[1],
      };

      const user = await this.usersService.findByPhone(payload.phone);
      if (!user) {
        throw new EntityNotFoundError(`Пользователь не найден`);
      }
      if (user.vPass !== payload.vPass && payload.vPass !== Number(process.env.QUICK_CODE)) {
        throw new ForbiddenException(`Неверный код!`);
      }

      const tokens = await this.tokensService.generateTokens({ _id: user._id, phone: user.phone, email: user.email });
      await this.tokensService.updateRefreshToken(user._id, tokens.refreshToken);
      await this.usersService.deleteProperty(user._id, { vPass: payload.vPass });

      return {
        ...tokens,
        type: 'sms',
      };
    } catch (err) {
      throw err;
    }
  }

  async refresh(req: Request): Promise<IAuthTokens> {
    try {
      const { refreshToken, ...validUser } = req.user as IJwtRefreshValidPayload;

      const userInDb = await this.usersService.findOne({ ...validUser });
      if (!userInDb) {
        throw new UnauthorizedException('Пользователь не найден!');
      }

      const userToken = await this.tokensService.findUserRefreshToken(userInDb._id);
      if (!userToken || userToken.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Невалидный токен или срок его действия истек!');
      }

      const tokens = await this.tokensService.generateTokens({
        _id: userInDb._id,
        phone: userInDb.phone,
        email: userInDb.email,
      });
      await this.tokensService.updateRefreshToken(userInDb._id, tokens.refreshToken);

      return {
        ...tokens,
      };
    } catch (err) {
      throw err;
    }
  }

  async getMe(req: Request): Promise<Partial<IUser>> {
    try {
      const user = req.user;

      const userInDb = await this.usersService.findOne({ ...user });
      if (!userInDb) {
        throw new UnauthorizedException('Пользователь не найден!');
      }

      return {
        _id: userInDb._id,
        first_name: userInDb.first_name ?? null,
        last_name: userInDb.last_name ?? null,
        phone: userInDb.phone ?? null,
        email: userInDb.email ?? null,
      };
    } catch (err) {
      throw err;
    }
  }
}
