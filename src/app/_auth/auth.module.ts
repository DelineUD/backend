import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';

import { SmsModule } from '@app/sms/sms.module';
import { Tokens, TokensSchema } from './entities/tokens.entity';
import { Codes, CodesSchema } from './entities/codes.entity';
import { TokensService } from './services/tokens.service';
import { CodesService } from './services/codes.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { STRATEGIES } from './strategies';
import { GUARDS } from './guards';
import { UsersModule } from '@app/_users/users.module';

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
    SmsModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokensService, CodesService, ...STRATEGIES, ...GUARDS],
})
export class AuthModule {}
