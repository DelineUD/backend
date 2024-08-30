import { BadRequestException, ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { Request } from 'express';
import { Types } from 'mongoose';

import { UsersService } from '@/app/users/users.service';
import { AuthRegisterOtpDto } from '@app/auth/dto/auth-register-otp.dto';
import { FilterKeys } from '@app/filters/consts';
import { UpdateFiltersDto } from '@app/filters/dto/update-filters.dto';
import { FiltersService } from '@app/filters/filters.service';
import { SmsService } from '@app/sms/sms.service';
import { AuthLoginOtpDto } from './dto/auth-login-otp.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthSendOtpDto } from './dto/auth-send-otp.dto';
import { IAuthTokens } from './interfaces/auth-tokens.interface';
import { IJwtRefreshValidPayload } from './interfaces/jwt.interface';
import { IProfileResponse } from './interfaces/profile-response.interface';
import { profileMapper } from './mappers/profile.mapper';
import { CodesService } from './services/codes.service';
import { TokensService } from './services/tokens.service';
import { AuthLoginResponseType } from './types/auth-login-response.type';
import { AuthRegisterResponseType } from './types/auth-register-response.type';
import { AuthSendSmsResponseType } from './types/auth-send-sms-response.type';

const logger = new Logger('_Auth');

@Injectable()
export class AuthService {
  constructor(
    private readonly tokensService: TokensService,
    private readonly codesService: CodesService,
    private readonly smsService: SmsService,
    private readonly filtersService: FiltersService,
    private readonly usersService: UsersService,
  ) {}

  async register(
    { phone, password, ...dto }: AuthRegisterDto,
    avatar: Express.Multer.File,
  ): Promise<AuthRegisterResponseType> {
    try {
      const userInDb = await this.usersService.findOne({ phone });
      if (userInDb) throw new BadRequestException('Пользователь с этим номером уже зарегистрирован.');

      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      const pathToAvatar = avatar
        ? `${process.env.SERVER_URL}/${process.env.STATIC_PATH}/${process.env.IMAGES_FOLDER}/${avatar.filename}`
        : null;

      const user = await this.usersService.create({
        ...dto,
        phone,
        avatar: pathToAvatar,
        password: hashPassword,
      });

      if (!user) throw new BadRequestException('Произошла непредвиденная ошибка!');

      const updateFilters: UpdateFiltersDto = {
        [FilterKeys.City]: user.city,
        [FilterKeys.Spec]: user.specialization,
        [FilterKeys.Programs]: user.programs,
      };
      this.filtersService.update(updateFilters).then(() => logger.log('Fillers successfully updated!'));

      return await this.tokensService.generateTokens({ _id: user._id, phone: user.phone, email: user.email });
    } catch (err) {
      logger.error(`Error while register: ${(err as Error).message}`);
      throw err;
    }
  }

  async login(dto: AuthLoginDto): Promise<AuthLoginResponseType> {
    try {
      const userInDb = await this.usersService.findByLogin(dto);

      const tokens = await this.tokensService.generateTokens({
        _id: userInDb._id,
        phone: userInDb.phone,
        email: userInDb.email,
      });
      await this.tokensService.updateRefreshToken(userInDb._id, tokens.refresh_token);

      return tokens;
    } catch (err) {
      logger.error(`Error while login: ${(err as Error).message}`);
      throw err;
    }
  }

  async registerOtp(dto: AuthRegisterOtpDto): Promise<void> {
    const { phone, otp } = dto;

    if (!phone || !otp) throw new BadRequestException('Неверные данные!');

    const userInDb = await this.usersService.findByPhone(phone);
    if (userInDb) throw new BadRequestException('Пользователь c этим номером уже зарегистрирован.');

    const otpCode = await this.codesService.findCodeByPayload({
      user_phone: phone,
    });
    if (!otpCode) throw new ForbiddenException(`Срок действия кода истек.`);

    if (otpCode.otp !== +otp && Number(process.env.QUICK_CODE) !== +otp)
      throw new ForbiddenException(`Неверно введен код из СМС.`);

    await this.codesService.deleteCodeById(otpCode._id);

    return;
  }

  async registerOtpSend(dto: AuthSendOtpDto): Promise<AuthSendSmsResponseType> {
    try {
      const { phone } = dto;

      const userInDb = await this.usersService.findByPhone(phone);
      if (userInDb) throw new BadRequestException('Пользователь c этим номером уже зарегистрирован.');

      const otpCode = await this.codesService.generateCode({ userPhone: phone });
      const msg = `Код для подтверждения: ${otpCode.otp}.`;

      const { status, status_code } = await this.smsService.send(phone, msg);
      if (status_code !== 100) {
        await this.codesService.deleteCodeById(otpCode._id);
        throw new BadRequestException('Ошибка при отправке sms!');
      }

      return { status, status_code };
    } catch (err) {
      logger.error(`Error while sendSms: ${(err as Error).message}`);
      throw err;
    }
  }

  async loginOtp(dto: AuthLoginOtpDto): Promise<AuthLoginResponseType> {
    try {
      const { phone, otp } = dto;

      if (!phone || !otp) throw new BadRequestException('Неверные данные для входа!');

      const userInDb = await this.usersService.findByPhone(phone);
      if (!userInDb) throw new BadRequestException('Пользователь c этим номером не зарегистрирован.');

      const authCode = await this.codesService.findCodeByPayload({
        user_phone: userInDb.phone,
      });
      if (!authCode) throw new ForbiddenException(`Срок действия кода истек!`);

      if (authCode.otp !== Number(otp) && Number(process.env.QUICK_CODE) !== Number(otp))
        throw new ForbiddenException(`Неверный код!`);

      const tokens = await this.tokensService.generateTokens({
        _id: userInDb._id,
        phone: userInDb.phone,
        email: userInDb.email,
      });
      await this.tokensService.updateRefreshToken(userInDb._id, tokens.refresh_token);
      await this.codesService.deleteCodeById(authCode._id);

      return tokens;
    } catch (err) {
      logger.error(`Error while loginOtp: ${(err as Error).message}`);
      throw err;
    }
  }

  async loginOtpSend(dto: AuthSendOtpDto): Promise<AuthSendSmsResponseType> {
    try {
      const { phone } = dto;

      const userInDb = await this.usersService.findByPhone(phone);
      if (!userInDb) throw new BadRequestException('Пользователь c этим номером не зарегистрирован.');

      const authCode = await this.codesService.generateCode({ userPhone: userInDb.phone });
      const msg = `${authCode.otp} — ваш код для входа в приложение Умный Дизайн. Никому не сообщайте его!`;

      const smsRes = await this.smsService.send(userInDb.phone, msg);
      if (smsRes.status_code !== 100) {
        await this.codesService.deleteCodeById(authCode._id);
        throw new BadRequestException('Ошибка при отправке sms!');
      }

      return smsRes;
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

  async getProfile(req: Request): Promise<IProfileResponse> {
    try {
      const user = req.user as { _id: Types.ObjectId; phone: string };
      const userInDb = await this.usersService.findOne({ phone: user.phone });
      if (!userInDb) throw new UnauthorizedException('Пользователь не найден!');

      return profileMapper(userInDb);
    } catch (err) {
      logger.error(`Error while getMe: ${(err as Error).message}`);
      throw err;
    }
  }
}
