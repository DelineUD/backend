import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto,
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
  public async testAuth(@Req() req: any): Promise<JwtPayload> {
    return req.user;
  }
  //sans
  @Post('checkUserExists') //проверка по телефону первый экран авторизации
  public async checkUserExists(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<checkUserExists> {
    return await this.authService.checkUserExists(loginUserDto);
  }

  @Post('loginSms') // логин по смс
  public async loginSms(@Body() loginUserDto: LoginUserDto): Promise<loginSms> {
    if (loginUserDto.vpass !== 1111) {
      throw new HttpException(
        'не верный одноразовый пароль',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!loginUserDto.phone) {
      throw new HttpException(
        'поле phone обязательно!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.authService.loginSms(loginUserDto);
  }
  @Post('refresh')
  async getNewTokens(@Headers() data: RefreshTokenDto) {
    return this.authService.getNewTokens(data);
  }

  @Get('getMe')
  async getMeH(@Headers() data: RefreshTokenDto) {
    return this.authService.getMe(data);
  }
}
