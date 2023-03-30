import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { RegistrationStatus } from './interfaces/regisration-status.interface';
import { LoginStatus } from './interfaces/login-status.interface';
import { checkUserExists } from './interfaces/checkUserExists.interface';
import { LoginUserDto } from '../users/dto/user-login.dto';
import { JwtPayload } from './interfaces/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/user.create.dto';
import { UserDto } from '../users/dto/user.dto';
import { loginSms } from './interfaces/loginSms.interface';
import HttpStatusCode from 'http-status-typed';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { LoginSmsDto } from '../users/dto/login-sms.dto';


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
      _id:user._id,
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
      expiresIn: '10m',
    });
    const refreshToken = this.jwtService.sign(user, {
      expiresIn: '100h',
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

  async getMe({ refreshtoken }: RefreshTokenDto) {
    if (!refreshtoken) throw new UnauthorizedException('Please sign in!');

    try {
      await await this.jwtService.verifyAsync(refreshtoken);
    } catch (err) {
      throw new UnauthorizedException('Invalid token or expired!');
    }

    return this.jwtService.verifyAsync(refreshtoken);
  }

}
