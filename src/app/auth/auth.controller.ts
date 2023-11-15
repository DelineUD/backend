import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginSmsDto } from './dto/login-sms.dto';
import { LoginUserDto } from '../users/dto/user-login.dto';
import { CreateUserDto } from '../users/dto/user-create.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { checkUserExists } from './interfaces/checkUserExists.interface';
import { JwtResponse } from './interfaces/login-jwt.interface';
import { LoginStatus } from './interfaces/login-status.interface';
import { SmsResponse } from './interfaces/login-sms.interface';
import { RegistrationStatus } from './interfaces/regisration-status.interface';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('register-or-update')
  public async register(
    @Query() createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus = await this.authService.register(
      createUserDto,
    );

    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  public async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<LoginStatus<JwtResponse>> {
    return await this.authService.login(loginUserDto);
  }

  //sans
  @Post('check-user-exists') //проверка по телефону первый экран авторизации
  public async checkUserExists(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<checkUserExists> {
    return await this.authService.checkUserExists(loginUserDto);
  }

  @Post('login-sms')
  public async loginSms(
    @Body() LoginSmsDto: LoginSmsDto,
  ): Promise<LoginStatus<SmsResponse>> {
    if (LoginSmsDto.vPass !== 1111) {
      throw new HttpException(
        'Неверный одноразовый пароль',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!LoginSmsDto.phone) {
      throw new HttpException(
        'Поле phone обязательно!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.authService.loginSms(LoginSmsDto);
  }

  @Post('refresh')
  async getNewTokens(@Headers() data: RefreshTokenDto) {
    console.log(data);
    return this.authService.getNewTokens(data);
  }

  @Get('profile')
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  async getMe(@Headers() data: RefreshTokenDto) {
    return this.authService.getMe(data);
  }
}
