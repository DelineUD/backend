import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { SmsService } from '@app/auth/services/sms.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { Codes, CodesSchema } from '@app/auth/entities/codes.entity';
import { Tokens, TokensSchema } from '@app/auth/entities/tokens.entity';

import { CodesService } from '@app/auth/services/codes.service';
import { TokensService } from '@app/auth/services/tokens.service';
import { AppVersionInterceptor } from '@app/shared/interceptors/app-version.interceptor';
import { GUARDS } from './guards';
import { STRATEGIES } from './strategies';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tokens.name,
        schema: TokensSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Codes.name,
        schema: CodesSchema,
      },
    ]),
    JwtModule.register({}),
    PassportModule,
    UsersModule,
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokensService, SmsService, CodesService, AppVersionInterceptor, ...STRATEGIES, ...GUARDS],
  exports: [AuthService, SmsService],
})
export class AuthModule {}
