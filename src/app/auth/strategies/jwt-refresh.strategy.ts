import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { IJwtPayload, IJwtRefreshValidPayload } from '@app/auth/interfaces/jwt.interface';
import { AuthService } from '@app/auth/auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly configService: ConfigService, readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('refreshtoken'),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: IJwtPayload): IJwtRefreshValidPayload {
    try {
      const refreshToken = req.get('refreshtoken').trim();
      return { _id: payload._id, phone: payload.phone, email: payload.email, refreshToken };
    } catch (err) {
      throw err;
    }
  }
}
