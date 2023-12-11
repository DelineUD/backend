import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { SmsService } from '@shared/services/sms.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { STRATEGIES } from './strategies';
import { GUARDS } from './guards';

@Module({
  imports: [PassportModule, JwtModule.register({}), UsersModule, HttpModule],
  controllers: [AuthController],
  providers: [AuthService, SmsService, ...STRATEGIES, ...GUARDS],
  exports: [AuthModule, JwtModule, SmsService],
})
export class AuthModule {}
