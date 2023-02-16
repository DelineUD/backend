import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { RegistrationStatus } from './interfaces/regisration-status.interface';
import { LoginStatus } from './interfaces/login-status.interface';
import { LoginStatus1 } from './interfaces/login-status1.interface';
import { LoginUserDto } from '../users/dto/user-login.dto';
import { JwtPayload } from './interfaces/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/user.create.dto';
import { UserDto } from '../users/dto/user.dto';
import { LoginStatus2 } from './interfaces/login-status2.interface';
import HttpStatusCode from 'http-status-typed';
import { RefreshTokenDto } from './dto/refreshToken.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'user registered',
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
      ...token
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
			expiresIn: '1h',
		})
    const refreshToken = this.jwtService.sign(user, {
			expiresIn: '15d',
		});

    return {
      accessToken,
      refreshToken 
    };
  }

  async login1(loginUserDto: LoginUserDto): Promise<LoginStatus1> {
    const user = await this.usersService.findByPhone(loginUserDto);
    return {
   phone: user.phone,
   status: HttpStatusCode.OK
     };
    
  }

  async login2(loginUserDto: LoginUserDto): Promise<LoginStatus2> {
    const user = await this.usersService.findByPhone(loginUserDto);
    const token = this._createToken(user);
    return {
      user: user.phone,
   ...token
     };
    
  }

 async getNewTokens({ refreshToken }: RefreshTokenDto) {
	if (!refreshToken) throw new UnauthorizedException('Please sign in!')

	const result = await this.jwtService.verifyAsync(refreshToken)

		if (!result) throw new UnauthorizedException('Invalid token or expired!')

 const user = await this.usersService.findByPhone(result);

 const token = this._createToken(user);

	return {
    
    result,
			...token
		}
	}

 }