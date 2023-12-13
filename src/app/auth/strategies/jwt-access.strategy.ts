import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '@app/auth/auth.service';
import { IJwtAccessValidPayload, IJwtPayload } from '@app/auth/interfaces/jwt.interface';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService, readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
    });
  }

  validate(payload: IJwtPayload): IJwtAccessValidPayload {
    return { _id: payload._id, phone: payload.phone, email: payload.email };
  }
}
