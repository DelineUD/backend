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
import { IJwtResponse } from './interfaces/loginJwt.interface';
import { ILoginStatus } from './interfaces/loginStatus.interface';
import { RegistrationStatus } from './interfaces/regisration-status.interface';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt.guard';
import { ILoginSmsResponse } from './interfaces/loginSms.interface';
import { ISensSmsResponse } from './interfaces/sendSms.interface';
import { SendSmsDto } from './dto/send-sms.dto';

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
  ): Promise<ILoginStatus<IJwtResponse>> {
    return await this.authService.login(loginUserDto);
  }

  @Post('check-user-exists')
  public async checkUserExists(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<checkUserExists> {
    return await this.authService.checkUserExists(loginUserDto);
  }

  @Post('send-sms')
  public async sendSms(
    @Body() sendSmsDto: SendSmsDto,
  ): Promise<ISensSmsResponse> {
    return await this.authService.sendSms(sendSmsDto);
  }

  @Get('login-sms')
  public async loginSms(
    @Headers() data: LoginSmsDto,
  ): Promise<ILoginStatus<ILoginSmsResponse>> {
    return await this.authService.loginSms(data);
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
