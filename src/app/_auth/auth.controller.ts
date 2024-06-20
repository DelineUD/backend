import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

import { fileStorage } from '@shared/storage';
import { IUser } from '@app/_users/interfaces/user.interface';
import { AuthRegisterOtpDto } from '@app/_auth/dto/auth-register-otp.dto';
import { imageFileFilter } from '@utils/imageFileFilter';
import { JwtAuthRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-access.guard';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthLoginOtpDto } from './dto/auth-login-otp.dto';
import { AuthSendOtpDto } from './dto/auth-send-otp.dto';
import { AuthProfileCheckDto } from './dto/auth-profile-check.dto';
import { IAuthTokens } from './interfaces/auth-tokens.interface';
import { IAuthRegisterResponse } from './types/auth-register-response';
import { IAuthLoginResponse } from './types/auth-login-response';
import { AuthService } from './auth.service';

@ApiTags('_Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Регистрация пользователя
   * @param authRegisterDto - данные для регистрации
   * @param avatar - файл для аватара пользователя
   * @returns - пара токенов
   */
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: AuthRegisterDto })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: fileStorage,
      fileFilter: imageFileFilter,
    }),
  )
  @Post('register')
  public async register(
    @Body() authRegisterDto: AuthRegisterDto,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<IAuthRegisterResponse> {
    return await this.authService.register(authRegisterDto, avatar);
  }

  /**
   * Отправка sms с кодом для подтверждения номера при регистрации
   * @param authSendOtpDto - данные для отправки sms кода
   * @returns - 200 | 400
   */
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  @Post('register/send/otp')
  public async registerOtpSend(@Body() authSendOtpDto: AuthSendOtpDto): Promise<void> {
    return await this.authService.registerOtpSend(authSendOtpDto);
  }

  /**
   * Подтверждения номера при регистрации
   * @param authRegisterOtpDto - данные для подтверждения номера
   * @returns - 200 | 400
   */
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  @Post('register/otp')
  public async registerOtp(@Body() authRegisterOtpDto: AuthRegisterOtpDto): Promise<void> {
    return await this.authService.registerOtp(authRegisterOtpDto);
  }

  /**
   * Вход по паролю
   * @param authLoginDto - данные для входа.
   * @returns - пара токенов
   */
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('login')
  public async login(@Body() authLoginDto: AuthLoginDto): Promise<IAuthLoginResponse> {
    return await this.authService.login(authLoginDto);
  }

  /**
   * Вход по sms коду
   * @param authLoginOtpDto - данные для входа
   * @returns - пара токенов
   */
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('login/otp')
  public async loginOtp(@Body() authLoginOtpDto: AuthLoginOtpDto): Promise<IAuthLoginResponse> {
    return await this.authService.loginOtp(authLoginOtpDto);
  }

  /**
   * Отправка sms с кодом для входа
   * @param authSendOtpDto - данные для отправки sms кода
   * @returns - 200 | 400 | 404
   */
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  @Post('login/send/otp')
  public async loginOtpSend(@Body() authSendOtpDto: AuthSendOtpDto): Promise<void> {
    return await this.authService.loginOtpSend(authSendOtpDto);
  }

  /**
   * Обновление токенов
   * @param req - данные запрса через access стратегию
   * @returns - пара токенов
   */
  @UseGuards(JwtAuthRefreshGuard)
  @ApiBearerAuth('defaultBearerAuth')
  @ApiHeader({ name: 'refreshToken' })
  @Post('tokens/refresh')
  async refreshTokens(@Req() req: Request): Promise<IAuthTokens> {
    return this.authService.refreshTokens(req);
  }

  /**
   * Проверка пользователя на регистрацию
   * @param authProfileCheckDto - данные проверки пользователя на регистрацию
   * @returns - 200 | 400
   */
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('profile/check')
  async profileCheck(@Body() authProfileCheckDto: AuthProfileCheckDto): Promise<void> {
    return this.authService.checkProfile(authProfileCheckDto);
  }

  /**
   * Получение пользователя
   * @param req - данные запрса через access стратегию
   * @returns -   пользователь
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('defaultBearerAuth')
  @Get('profile')
  async getMe(@Req() req: Request): Promise<Partial<IUser>> {
    return this.authService.getProfile(req);
  }
}
