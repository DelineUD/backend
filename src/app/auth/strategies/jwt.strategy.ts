import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '../auth.service';
import { JwtPayloadProfile } from '../interfaces/payload-profile.interface';
import { IUser } from '@app/users/interfaces/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_KEY + '',
    });
  }

  async validate(payload: JwtPayloadProfile): Promise<IUser> {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new HttpException('Невалидный токен!', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
