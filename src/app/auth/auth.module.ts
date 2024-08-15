import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '@/app/users/users.module';
import { FiltersModule } from '@app/filters/filters.module';
import { SmsModule } from '@app/sms/sms.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Codes, CodesSchema } from './entities/codes.entity';
import { Tokens, TokensSchema } from './entities/tokens.entity';
import { GUARDS } from './guards';
import { CodesService } from './services/codes.service';
import { TokensService } from './services/tokens.service';
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
    SmsModule,
    FiltersModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokensService, CodesService, ...STRATEGIES, ...GUARDS],
})
export class AuthModule {}
