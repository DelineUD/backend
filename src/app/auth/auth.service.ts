import { BadRequestException, ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Promise, Types } from 'mongoose';
import { Request } from 'express';

import { CodesService } from '@app/auth/services/codes.service';
import { SmsService } from '@app/auth/services/sms.service';
import { CreateUserDto } from '@app/users/dto/user-create.dto';
import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';
import { IUser } from '../users/interfaces/user.interface';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/user-login.dto';
import { IAuthTokens } from './interfaces/auth-tokens.interface';
import { IJwtRefreshValidPayload } from './interfaces/jwt.interface';
import { ILoginResponse, ILoginSmsPayload } from './interfaces/login.interface';
import { RegistrationStatus } from './interfaces/regisration-status.interface';
import { ISensSmsResponse } from './interfaces/send-sms.interface';
import { LoginSmsDto } from './dto/login-sms.dto';
import { SendSmsDto } from './dto/send-sms.dto';
import { TokensService } from './services/tokens.service';

const logger = new Logger('Auth');

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly codesService: CodesService,
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
      logger.error(`Error while register: ${(err as Error).message}`);
      throw err;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { _id } = await this.usersService.findOne({ id });
      if (!_id) {
        throw new EntityNotFoundError('Пользователь не найден');
      }

      await Promise.allSettled([
        await this.usersService.deleteUser(_id),
        await this.usersService.deleteUserPosts(_id),
        await this.usersService.deleteUserResumes(_id),
        await this.usersService.deleteUserVacancies(_id),
      ]);

      return;
    } catch (err) {
      logger.error(`Error while delete: ${(err as Error).message}`);
      throw err;
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<ILoginResponse> {
    try {
      const user = await this.usersService.findByLogin(loginUserDto);

      const tokens = await this.tokensService.generateTokens({ _id: user._id, phone: user.phone, email: user.email });
      await this.tokensService.updateRefreshToken(user._id, tokens.refreshToken);

      return {
        ...tokens,
        type: 'password',
      };
    } catch (err) {
      logger.error(`Error while login: ${(err as Error).message}`);
      throw err;
    }
  }

  async sendSms({ phone }: SendSmsDto): Promise<ISensSmsResponse> {
    try {
      const user = await this.usersService.findByPhone(phone);
      if (!user) {
        throw new UnauthorizedException(`Пользователь с номером: ${phone} не найден!`);
      }

      const authCode = await this.codesService.generateCode(user._id, user.phone);
      const msg = `${authCode.otp} — ваш код для входа в приложение Умный Дизайн. Никому не сообщайте его!`;

      const { status, status_code } = await this.smsService.send(user.phone, msg);
      if (status_code !== 100) {
        await this.codesService.deleteCodeById(authCode._id);
      }

      return {
        status,
        status_code,
      };
    } catch (err) {
      logger.error(`Error while sendSms: ${(err as Error).message}`);
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

      const authCode = await this.codesService.findCodeByPayload({
        userId: user._id,
        userPhone: user.phone,
      });
      if (!authCode) {
        throw new ForbiddenException(`Срок действия кода истек!`);
      }

      if (authCode.otp !== payload.vPass && payload.vPass !== Number(process.env.QUICK_CODE)) {
        throw new ForbiddenException(`Неверный код!`);
      }

      const tokens = await this.tokensService.generateTokens({ _id: user._id, phone: user.phone, email: user.email });
      await this.tokensService.updateRefreshToken(user._id, tokens.refreshToken);
      await this.codesService.deleteCodeById(authCode._id);

      return {
        ...tokens,
        type: 'sms',
      };
    } catch (err) {
      logger.error(`Error while loginSms: ${(err as Error).message}`);
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
      logger.error(`Error while refresh: ${(err as Error).message}`);
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
        first_name: userInDb.first_name,
        last_name: userInDb.last_name ?? '',
        phone: userInDb.phone ?? null,
        email: userInDb.email ?? null,
        avatar: userInDb.avatar ?? null,
        is_eula_approved: userInDb.is_eula_approved ?? false,
      };
    } catch (err) {
      logger.error(`Error while getMe: ${(err as Error).message}`);
      throw err;
    }
  }

  async approveEua(userId: Types.ObjectId): Promise<void> {
    try {
      await this.usersService.updateByPayload({ _id: userId }, { is_eula_approved: true });
      return;
    } catch (err) {
      logger.error(`Error while approvedEua: ${(err as Error).message}`);
      throw err;
    }
  }
}
