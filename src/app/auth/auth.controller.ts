import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Types } from 'mongoose';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-access.guard';

import { RegistrationStatus } from './interfaces/regisration-status.interface';
import { ISensSmsResponse } from './interfaces/send-sms.interface';

import { LoginUserDto } from '../users/dto/user-login.dto';
import { CreateUserDto } from '../users/dto/user-create.dto';
import { SendSmsDto } from './dto/send-sms.dto';
import { LoginSmsDto } from './dto/login-sms.dto';
import { UserId } from '@shared/decorators/user-id.decorator';
import { ILoginResponse } from '@app/auth/interfaces/login.interface';
import { JwtAuthRefreshGuard } from '@app/auth/guards/jwt-refresh.guard';
import { IAuthTokens } from '@app/auth/interfaces/auth-tokens.interface';
import { IUser } from '@app/users/interfaces/user.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Регистрация и обновление пользователя.
   * @param createUserDto - данные пользователя.
   * @returns - Статус регистрации
   */
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('register-or-update')
  public async register(@Query() createUserDto: CreateUserDto): Promise<RegistrationStatus> {
    return await this.authService.register(createUserDto);
  }

  /**
   * Вход по паролю.
   * @param loginUserDto - данные входа.
   * @returns - Пара токенов и тип входа
   */
  @UsePipes(new ValidationPipe())
  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto): Promise<ILoginResponse> {
    return await this.authService.login(loginUserDto);
  }

  /**
   * Отправка sms кода.
   * @param sendSmsDto - данные для отправки sms.
   * @returns - ответ от стороннего api
   */
  @Post('send-sms')
  public async sendSms(@Body() sendSmsDto: SendSmsDto): Promise<ISensSmsResponse> {
    return await this.authService.sendSms(sendSmsDto);
  }

  /**
   * Вход по sms.
   * @param headers - данные входа по sms.
   * @returns - Пара токенов и тип входа
   */
  @Get('login-sms')
  @ApiHeader({
    name: 'User-Login-Data',
    description: 'User-Login-Data: phone code',
  })
  public async loginSms(@Headers() headers: LoginSmsDto): Promise<ILoginResponse> {
    return await this.authService.loginSms(headers);
  }

  /**
   * Обновление токенов.
   * @param req - данные запрса через refresh стратегию.
   * @returns - Пара токенов.
   */
  @UseGuards(JwtAuthRefreshGuard)
  @ApiBearerAuth('defaultBearerAuth')
  @ApiHeader({ name: 'refreshToken' })
  @Post('refresh')
  async getNewTokens(@Req() req: Request): Promise<IAuthTokens> {
    return this.authService.refresh(req);
  }

  /**
   * Получение пользователя.
   * @param req - данные запрса через access стратегию.
   * @returns - Пользователь.
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('defaultBearerAuth')
  @Get('profile')
  async getMe(@Req() req: Request): Promise<Partial<IUser>> {
    return this.authService.getMe(req);
  }

  /**
   * Приянять соглашение eua.
   * @param userId - системный идентификатор пользователя.
   * @returns - void.
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('defaultBearerAuth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('profile/eua')
  async approveEua(@UserId() userId: Types.ObjectId): Promise<void> {
    return this.authService.approveEua(userId);
  }
}
