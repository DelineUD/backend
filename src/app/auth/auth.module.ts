import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';

import { SmsService } from '@shared/services/sms.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { Auth, AuthSchema } from '@app/auth/entities/auth.entity';

import { STRATEGIES } from './strategies';
import { GUARDS } from './guards';
import { TokensService } from '@app/auth/services/tokens.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Auth.name,
        schema: AuthSchema,
      },
    ]),
    JwtModule.register({}),
    PassportModule,
    UsersModule,
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokensService, SmsService, ...STRATEGIES, ...GUARDS],
  exports: [AuthService, SmsService],
})
export class AuthModule {}
