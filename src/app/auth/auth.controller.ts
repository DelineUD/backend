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
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';

import { ILoginSmsResponse } from './interfaces/login-sms.interface';
import { RegistrationStatus } from './interfaces/regisration-status.interface';
import { ISensSmsResponse } from './interfaces/send-sms.interface';
import { IJwtResponse } from './interfaces/login-jwt.interface';
import { ILoginStatus } from './interfaces/login-status.interface';

import { LoginUserDto } from '../users/dto/user-login.dto';
import { CreateUserDto } from '../users/dto/user-create.dto';
import { GetMeDto } from './dto/get-me.dto';
import { SendSmsDto } from './dto/send-sms.dto';
import { LoginSmsDto } from './dto/login-sms.dto';
import { GetNewTokensDto } from './dto/get-new-tokens.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('register-or-update')
  public async register(
    @Query()
    createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus = await this.authService.register(createUserDto);

    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto): Promise<ILoginStatus<IJwtResponse>> {
    return await this.authService.login(loginUserDto);
  }

  @Post('send-sms')
  public async sendSms(@Body() sendSmsDto: SendSmsDto): Promise<ISensSmsResponse> {
    return await this.authService.sendSms(sendSmsDto);
  }

  @Post('refresh')
  async getNewTokens(@Body() data: GetNewTokensDto) {
    return this.authService.getNewTokens(data);
  }

  @Get('login-sms')
  @ApiHeader({
    name: 'User-Login-Data',
    description: 'User-Login-Data: phone code',
  })
  public async loginSms(@Headers() headers: LoginSmsDto): Promise<ILoginStatus<ILoginSmsResponse>> {
    return await this.authService.loginSms(headers);
  }

  @Get('profile')
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  async getMe(@Headers() data: GetMeDto) {
    return this.authService.getMe(data);
  }
}
