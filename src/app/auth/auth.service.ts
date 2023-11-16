import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import HttpStatusCode from 'http-status-typed';
import { SMSService } from '../../apis/index';
import { JwtService } from '@nestjs/jwt';

import { checkUserExists } from './interfaces/checkUserExists.interface';
import { ILoginStatus } from './interfaces/loginStatus.interface';
import { JwtPayload } from './interfaces/payload.interface';
import { RegistrationStatus } from './interfaces/regisration-status.interface';

import { UserDto } from '../users/dto/user.dto';
import { CreateUserDto } from '../users/dto/user-create.dto';
import { LoginUserDto } from '../users/dto/user-login.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

import { UsersService } from '../users/users.service';
import { IJwtResponse } from './interfaces/loginJwt.interface';
import generateOTPCode from '../shared/utils/generateOTPCode';
import { ILoginSmsResponse } from './interfaces/loginSms.interface';
import { ISensSmsResponse } from './interfaces/sendSms.interface';
import { SendSmsDto } from './dto/send-sms.dto';
import { UserModel } from '../users/models/user.model';
import { LoginSmsDto } from './dto/login-sms.dto';
import { IJwtPayload } from './interfaces/JwtPayload.interface';

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

  async login(loginUserDto: LoginUserDto): Promise<ILoginStatus<IJwtResponse>> {
    const user = await this.usersService.findByLogin(loginUserDto);
    const token = this._createToken(user);
    return {
      phone: user.phone,
      data: { ...token },
    };
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.findByPayload(payload as UserModel);
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

  async checkUserExists({ phone }: LoginUserDto): Promise<checkUserExists> {
    const user = await this.usersService.findByPhone(phone);
    return {
      phone: user.phone,
      status: HttpStatusCode.OK,
    };
  }

  async sendSms({ phone }: SendSmsDto): Promise<ISensSmsResponse> {
    const user = await this.usersService.findByPhone(phone);

    if (!user) {
      throw new UnauthorizedException(`User with phone: ${phone} not found!`);
    }

    const otpCode = generateOTPCode(4);
    const msg = `Код авторизации: ${otpCode}.`;
    const { status, status_code } = await SMSService.send(user.phone, msg);

    if (status_code === 100) {
      await this.usersService.update({ _id: user._id }, { vPass: otpCode });
    }

    return {
      status,
      status_code,
    };
  }

  async loginSms({
    authorization,
  }: LoginSmsDto): Promise<ILoginStatus<ILoginSmsResponse>> {
    if (!authorization) {
      throw new BadRequestException('Invalid authorization code or expired!');
    }

    const user = await this.usersService.findByPayload({
      vPass: authorization,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid authorization code!');
    }

    const tokens = this._createToken(user);
    await this.usersService.deleteProperty(user._id, { vPass: authorization });

    return {
      phone: user.phone,
      data: { ...tokens },
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

    const { phone }: IJwtPayload = await this.jwtService.verifyAsync(
      noBearer[1],
    );
    const user = await this.usersService.findByPhone(phone);

    return {
      _id: user._id,
      first_name: user.first_name ?? null,
      last_name: user.last_name ?? null,
      phone: user.phone ?? null,
      email: user.email ?? null,
    };
  }
}
