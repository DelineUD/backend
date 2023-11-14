import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import HttpStatusCode from 'http-status-typed';
import { JwtService } from '@nestjs/jwt';

import { checkUserExists } from './interfaces/checkUserExists.interface';
import { LoginStatus } from './interfaces/login-status.interface';
import { JwtPayload } from './interfaces/payload.interface';
import { RegistrationStatus } from './interfaces/regisration-status.interface';

import { UserDto } from '../users/dto/user.dto';
import { CreateUserDto } from '../users/dto/user-create.dto';
import { LoginUserDto } from '../users/dto/user-login.dto';
import { LoginSmsDto } from './dto/login-sms.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

import { UsersService } from '../users/users.service';
import { JwtResponse } from './interfaces/login-jwt.interface';
import { SmsResponse } from './interfaces/login-sms.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'User registered or updated',
    };

    try {
      await this.usersService.create(userDto);
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }
    return status;
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginStatus<JwtResponse>> {
    const user = await this.usersService.findByLogin(loginUserDto);
    console.log(user);
    const token = this._createToken(user);
    return {
      phone: user.phone,
      data: { ...token },
    };
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private _createToken({ phone }: UserDto): {
    accessToken: string;
    refreshToken: string;
  } {
    const user: JwtPayload = { phone };
    const accessToken = this.jwtService.sign(user, {
      expiresIn: '30d',
    });
    const refreshToken = this.jwtService.sign(user, {
      expiresIn: '30d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async checkUserExists(loginUserDto: LoginUserDto): Promise<checkUserExists> {
    const user = await this.usersService.findByPhone(loginUserDto);
    return {
      phone: user.phone,
      status: HttpStatusCode.OK,
    };
  }

  async loginSms(LoginSmsDto: LoginSmsDto): Promise<LoginStatus<SmsResponse>> {
    const user = await this.usersService.findByPhone(LoginSmsDto);
    return {
      phone: user.phone,
      data: { vPass: 1111 },
    };
  }

  async getNewTokens({ refreshtoken }: RefreshTokenDto) {
    if (!refreshtoken) throw new UnauthorizedException('Please sign in!');

    try {
      await this.jwtService.verifyAsync(refreshtoken);
    } catch (err) {
      throw new UnauthorizedException(
        'Invalid token or expired! Please Login again!',
      );
    }
    const result = await this.jwtService.verifyAsync(refreshtoken);
    const user = await this.usersService.findByPhone(result);

    const token = this._createToken(user);
    return {
      result,
      ...token,
    };
  }

  async getMe({ authorization }: RefreshTokenDto) {
    const noBearer = authorization.split(' ');
    if (!authorization) throw new UnauthorizedException('Please sign in!');

    try {
      await this.jwtService.verifyAsync(noBearer[1]);
    } catch (err) {
      console.log(noBearer[1]);
      throw new UnauthorizedException('Invalid token or expired!');
    }

    const result = await this.jwtService.verifyAsync(noBearer[1]);
    const user = await this.usersService.findByPhone(result);

    return {
      _id: user._id,
      first_name: user.first_name ?? null,
      last_name: user.last_name ?? null,
      phone: user.phone ?? null,
      email: user.email ?? null,
    };
  }
}
