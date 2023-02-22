import {
  Controller,
  Body,
  Headers,
  Param,
  Post,
  HttpException,
  HttpStatus,
  Get,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegistrationStatus } from './interfaces/regisration-status.interface';
import { AuthService } from './auth.service';
import { LoginStatus } from './interfaces/login-status.interface';
import { checkUserExists } from './interfaces/checkUserExists.interface';
import { LoginUserDto } from '../users/dto/user-login.dto';
import { JwtPayload } from './interfaces/payload.interface';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../users/dto/user.create.dto';
import { loginSms } from './interfaces/loginSms.interface';
import { RefreshTokenDto } from './dto/refreshToken.dto';


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
  public async loginSms(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<loginSms> {
    if (loginUserDto.vpass !== 1111) {
      throw new HttpException('не верный одноразовый пароль', HttpStatus.UNAUTHORIZED);
    }
    if (!loginUserDto.phone) {
      throw new HttpException('Tполе phone обязательно!', HttpStatus.BAD_REQUEST);
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

  //sans
}
