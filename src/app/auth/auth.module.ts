import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';

import { SmsService } from '@app/auth/services/sms.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { Tokens, TokensSchema } from '@app/auth/entities/tokens.entity';
import { Codes, CodesSchema } from '@app/auth/entities/codes.entity';

import { STRATEGIES } from './strategies';
import { GUARDS } from './guards';
import { TokensService } from '@app/auth/services/tokens.service';
import { CodesService } from '@app/auth/services/codes.service';

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
  providers: [AuthService, TokensService, SmsService, CodesService, ...STRATEGIES, ...GUARDS],
  exports: [AuthService, SmsService],
})
export class AuthModule {}
