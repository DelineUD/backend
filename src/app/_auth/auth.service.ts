import { BadRequestException, ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { SmsService } from '@app/sms/sms.service';
import { UsersService } from '@app/_users/users.service';
import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { IAuthRegisterResponse } from './types/auth-register-response';
import { AuthLoginDto } from './dto/auth-login.dto';
import { IAuthLoginResponse } from './types/auth-login-response';
import { AuthLoginOtpDto } from './dto/auth-login-otp.dto';
import { AuthSendOtpDto } from './dto/auth-send-otp.dto';
import { AuthProfileCheckDto } from './dto/auth-profile-check.dto';
import { CodesService } from './services/codes.service';
import { TokensService } from './services/tokens.service';
import { IAuthTokens } from './interfaces/auth-tokens.interface';
import { IJwtRefreshValidPayload } from './interfaces/jwt.interface';
import { IProfileResponse } from './interfaces/profile-response.interface';

const logger = new Logger('_Auth');

@Injectable()
export class AuthService {
  constructor(
    private readonly tokensService: TokensService,
    private readonly codesService: CodesService,
    private readonly smsService: SmsService,
    private readonly usersService: UsersService,
  ) {}

  async register(dto: AuthRegisterDto): Promise<IAuthRegisterResponse> {
    try {
      const res = {}; // TODO create user

      if (!res) throw new BadRequestException('Ошибка при регистрации!');

      const tokens = { access_token: '', refresh_token: '' }; // TODO create tokens

      return tokens as unknown as IAuthLoginResponse;
    } catch (err) {
      logger.error(`Error while register: ${(err as Error).message}`);
      throw err;
    }
  }

  async login(dto: AuthLoginDto): Promise<IAuthLoginResponse> {
    try {
      const userInDb = await this.usersService.findByLogin(dto);

      if (!userInDb) throw new EntityNotFoundError();

      const tokens = await this.tokensService.generateTokens({
        _id: userInDb._id,
        phone: userInDb.phone,
        email: userInDb.email,
      });
      await this.tokensService.updateRefreshToken(userInDb._id, tokens.refresh_token);

      return tokens as unknown as IAuthLoginResponse;
    } catch (err) {
      logger.error(`Error while login: ${(err as Error).message}`);
      throw err;
    }
  }

  async loginOtp(dto: AuthLoginOtpDto): Promise<IAuthLoginResponse> {
    try {
      const { phone, otp } = dto;

      if (!phone || !otp) throw new BadRequestException('Неверные данные для входа!');

      const userInDb = await this.usersService.findByPhone(phone);
      if (!userInDb) throw new EntityNotFoundError(`Пользователь не найден`);

      const authCode = await this.codesService.findCodeByPayload({
        userId: userInDb._id,
        userPhone: userInDb.phone,
      });
      if (!authCode) throw new ForbiddenException(`Срок действия кода истек!`);

      if (authCode.otp !== +otp && Number(process.env.QUICK_CODE) !== +otp)
        throw new ForbiddenException(`Неверный код!`);

      const tokens = await this.tokensService.generateTokens({
        _id: userInDb._id,
        phone: userInDb.phone,
        email: userInDb.email,
      });
      await this.tokensService.updateRefreshToken(userInDb._id, tokens.refresh_token);
      await this.codesService.deleteCodeById(authCode._id);

      return tokens as unknown as IAuthLoginResponse;
    } catch (err) {
      logger.error(`Error while loginOtp: ${(err as Error).message}`);
      throw err;
    }
  }

  async sendOtp(dto: AuthSendOtpDto): Promise<void> {
    try {
      const { phone } = dto;

      const userInDb = await this.usersService.findByPhone(phone);
      if (!userInDb) throw new EntityNotFoundError(`Пользователь не найден`);

      const authCode = await this.codesService.generateCode(userInDb._id, userInDb.phone);
      const msg = `${authCode.otp} — ваш код для входа в приложение Умный Дизайн. Никому не сообщайте его!`;

      const { status_code } = await this.smsService.send(userInDb.phone, msg);
      if (status_code !== 100) {
        await this.codesService.deleteCodeById(authCode._id);
        throw new BadRequestException('Ошибка при отправке sms!');
      }

      return;
    } catch (err) {
      logger.error(`Error while sendSms: ${(err as Error).message}`);
      throw err;
    }
  }

  async refreshTokens(req: Request): Promise<IAuthTokens> {
    try {
      const { refresh_token, ...validUser } = req.user as IJwtRefreshValidPayload;

      const userInDb = await this.usersService.findOne({ ...validUser });
      if (!userInDb) throw new UnauthorizedException('Пользователь не найден!');

      const userToken = await this.tokensService.findUserRefreshToken(userInDb._id);
      if (!userToken || userToken.refresh_token !== refresh_token) {
        throw new UnauthorizedException('Невалидный токен или срок его действия истек!');
      }

      const tokens = await this.tokensService.generateTokens({
        _id: userInDb._id,
        phone: userInDb.phone,
        email: userInDb.email,
      });
      await this.tokensService.updateRefreshToken(userInDb._id, tokens.refresh_token);

      return tokens;
    } catch (err) {
      logger.error(`Error while tokensRefresh: ${(err as Error).message}`);
      throw err;
    }
  }

  async checkProfile(dto: AuthProfileCheckDto): Promise<void> {
    try {
      const userInDb = await this.usersService.findOne({ ...dto });

      if (!userInDb) throw new EntityNotFoundError(`Пользователь не найден`);

      return;
    } catch (err) {
      logger.error(`Error while checkProfile: ${(err as Error).message}`);
    }
  }

  async getProfile(req: Request): Promise<IProfileResponse> {
    try {
      const user = req.user;

      const userInDb = await this.usersService.findOne({ ...user });
      if (!userInDb) throw new UnauthorizedException('Пользователь не найден!');

      return {
        _id: userInDb._id,
        first_name: userInDb.first_name,
        last_name: userInDb.last_name,
        phone: userInDb.phone,
        email: userInDb.email,
        avatar: userInDb.avatar ?? null,
        is_eula_approved: userInDb.is_eula_approved ?? false,
      };
    } catch (err) {
      logger.error(`Error while getMe: ${(err as Error).message}`);
      throw err;
    }
  }
}
