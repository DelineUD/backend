import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Tokens } from '@app/auth/entities/tokens.entity';
import { IAuthTokens } from '@app/auth/interfaces/auth-tokens.interface';
import { IJwtPayload } from '@app/auth/interfaces/jwt.interface';
import { UserEntity } from '@app/users/entities/user.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Tokens.name)
    private readonly tokensModel: Model<Tokens>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async findUserRefreshToken(userId: Types.ObjectId) {
    try {
      const token = this.tokensModel.findOne({ userId });

      if (!token) throw new UnauthorizedException('Невалидный токен!');

      return token;
    } catch (err) {
      throw err;
    }
  }

  async generateTokens(payload: Pick<UserEntity, '_id' | 'phone' | 'email'>): Promise<IAuthTokens> {
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
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (err) {
      throw err;
    }
  }

  async updateRefreshToken(userId: Types.ObjectId, token: string) {
    try {
      return await this.tokensModel.findOneAndUpdate({ user_id: userId }, { refresh_token: token }, { upsert: true });
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

  async validateRefreshToken(token: string): Promise<IJwtPayload & { refresh_token: string }> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch (err) {
      return null;
    }
  }
}
