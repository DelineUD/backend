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
import { AuthGuard } from '@nestjs/passport';
import { LoginSmsDto } from '../users/dto/login-sms.dto';
import { LoginUserDto } from '../users/dto/user-login.dto';
import { CreateUserDto } from '../users/dto/user.create.dto';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { checkUserExists } from './interfaces/checkUserExists.interface';
import { LoginStatus } from './interfaces/login-status.interface';
import { loginSms } from './interfaces/loginSms.interface';
import { JwtPayload } from './interfaces/payload.interface';
import { RegistrationStatus } from './interfaces/regisration-status.interface';

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
  public async login(@Body() loginUserDto: LoginUserDto): Promise<LoginStatus> {
    return await this.authService.login(loginUserDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard())
  public async testAuth(@Query() req: any): Promise<JwtPayload> {
    console.log(typeof req.user);
    return req.user;
  }
  //sans
  @Post('check-user-exists') //проверка по телефону первый экран авторизации
  public async checkUserExists(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<checkUserExists> {
    return await this.authService.checkUserExists(loginUserDto);
  }

  @Post('login-sms') // логин по смс
  public async loginSms(@Body() LoginSmsDto: LoginSmsDto): Promise<loginSms> {
    if (LoginSmsDto.vpass !== 1111) {
      throw new HttpException(
        'не верный одноразовый пароль',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!LoginSmsDto.phone) {
      throw new HttpException(
        'поле phone обязательно!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.authService.loginSms(LoginSmsDto);
  }
  @Post('refresh')
  async getNewTokens(@Headers() data: RefreshTokenDto) {
    return this.authService.getNewTokens(data);
  }

  @Get('getMe')
  async getMe(@Headers() data: RefreshTokenDto) {
    return this.authService.getMe(data);
  }
}
