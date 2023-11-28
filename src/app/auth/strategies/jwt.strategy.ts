import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserDto } from '@app/users/dto/user.dto';
import { AuthService } from '../auth.service';
import { JwtPayloadProfile } from '../interfaces/payload-profile.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_KEY + '',
    });
  }

  async validate(payload: JwtPayloadProfile): Promise<UserDto> {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new HttpException('Невалидный токен!', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
