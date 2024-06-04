import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IJwtPayload, IJwtRefreshValidPayload } from '../interfaces/jwt.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly configService: ConfigService, readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('refresh_token'),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: IJwtPayload): IJwtRefreshValidPayload {
    try {
      const refreshToken = req.get('refresh_token').trim();
      return { _id: payload._id, phone: payload.phone, email: payload.email, refresh_token: refreshToken };
    } catch (err) {
      throw err;
    }
  }
}
