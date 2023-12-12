import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Auth } from '@app/auth/entities/auth.entity';
import { IAuthTokens } from '@app/auth/interfaces/auth-tokens.interface';
import { IUser } from '@app/users/interfaces/user.interface';
import { IJwtPayload } from '@app/auth/interfaces/jwt.interface';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Auth.name)
    private readonly authModel: Model<Auth>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async findUserRefreshToken(userId: Types.ObjectId) {
    try {
      const token = this.authModel.findOne({ userId });
      if (!token) {
        throw new UnauthorizedException('Невалидный токен!');
      }
      return token;
    } catch (err) {
      throw err;
    }
  }

  async generateTokens(payload: Pick<IUser, '_id' | 'phone' | 'email'>): Promise<IAuthTokens> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          { ...payload },
          {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get<string>('A_EXPIRES_IN'),
          },
        ),
        this.jwtService.signAsync(payload, {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('R_EXPIRES_IN'),
        }),
      ]);

      return {
        accessToken,
        refreshToken,
      };
    } catch (err) {
      throw err;
    }
  }

  async updateRefreshToken(userId: Types.ObjectId, token: string) {
    try {
      return await this.authModel.findOneAndUpdate({ userId }, { refreshToken: token }, { upsert: true });
    } catch (err) {
      throw err;
    }
  }

  async validateAccessToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, { secret: this.configService.get<string>('JWT_ACCESS_SECRET') });
    } catch (err) {
      return null;
    }
  }

  async validateRefreshToken(token: string): Promise<IJwtPayload & { refreshToken: string }> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch (err) {
      return null;
    }
  }
}
