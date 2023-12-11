import { Body, Controller, Get, Headers, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-access.guard';

import { RegistrationStatus } from './interfaces/regisration-status.interface';
import { ISensSmsResponse } from './interfaces/send-sms.interface';

import { LoginUserDto } from '../users/dto/user-login.dto';
import { CreateUserDto } from '../users/dto/user-create.dto';
import { GetMeDto } from './dto/get-me.dto';
import { SendSmsDto } from './dto/send-sms.dto';
import { LoginSmsDto } from './dto/login-sms.dto';
import { ILoginResponse } from '@app/auth/interfaces/login.interface';
import { JwtAuthRefreshGuard } from '@app/auth/guards/jwt-refresh.guard';
import { IAuthTokens } from '@app/auth/interfaces/auth-tokens.interface';
import { IUser } from '@app/users/interfaces/user.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('register-or-update')
  public async register(
    @Query()
    createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus> {
    return await this.authService.register(createUserDto);
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto): Promise<ILoginResponse> {
    return await this.authService.login(loginUserDto);
  }

  @Post('send-sms')
  public async sendSms(@Body() sendSmsDto: SendSmsDto): Promise<ISensSmsResponse> {
    return await this.authService.sendSms(sendSmsDto);
  }

  @Get('login-sms')
  @ApiHeader({
    name: 'User-Login-Data',
    description: 'User-Login-Data: phone code',
  })
  public async loginSms(@Headers() headers: LoginSmsDto): Promise<ILoginResponse> {
    return await this.authService.loginSms(headers);
  }

  @UseGuards(JwtAuthRefreshGuard)
  @ApiBearerAuth('defaultBearerAuth')
  @Get('refresh')
  async getNewTokens(@Req() req: Request): Promise<IAuthTokens> {
    return this.authService.refresh(req);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('defaultBearerAuth')
  @Get('profile')
  async getMe(@Headers() data: GetMeDto): Promise<Partial<IUser>> {
    return this.authService.getMe(data);
  }
}
