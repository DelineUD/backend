import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import HttpStatusCode from 'http-status-typed';
import { LoginSmsDto } from '../users/dto/login-sms.dto';
import { LoginUserDto } from '../users/dto/user-login.dto';
import { CreateUserDto } from '../users/dto/user.create.dto';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { checkUserExists } from './interfaces/checkUserExists.interface';
import { LoginStatus } from './interfaces/login-status.interface';
import { loginSms } from './interfaces/loginSms.interface';
import { JwtPayload } from './interfaces/payload.interface';
import { RegistrationStatus } from './interfaces/regisration-status.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'user registered or updated',
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

  async login(loginUserDto: LoginUserDto): Promise<LoginStatus> {
    const user = await this.usersService.findByLogin(loginUserDto);
    const token = this._createToken(user);
    return {
      user: user.phone,
      _id: user._id,
      ...token,
    };
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private _createToken({ phone }: UserDto): any {
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

  async loginSms(LoginSmsDto: LoginSmsDto): Promise<loginSms> {
    const user = await this.usersService.findByPhone(LoginSmsDto);
    const token = this._createToken(user);
    return {
      user: user.phone,
      ...token,
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
      await await this.jwtService.verifyAsync(noBearer[1]);
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
