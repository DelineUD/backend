import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { IJwtPayload } from '@app/auth/interfaces/jwt.interface';
import { AuthService } from '@app/auth/auth.service';
import { IUser } from '@app/users/interfaces/user.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly configService: ConfigService, readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IJwtPayload): Promise<Partial<IUser> & { refreshToken: string }> {
    const refreshToken = req.headers.authorization?.replace('Bearer', '').trim();

    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const user = await this.authService.validateUser(payload);

    return { ...user, refreshToken };
  }
}
