import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { UserModel, UserSchema } from '../users/models/user.model';
import { UsersModule } from '../users/users.module';
import { ResidentsController } from './residents.controller';
import { ResidentsService } from './residents.service';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_KEY'),
          signOptions: {
            expiresIn: config.get<string>('EXPIRESIN'),
          },
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: UserModel.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [ResidentsController],
  providers: [ResidentsService, JwtStrategy, AuthService],
  exports: [PassportModule, JwtModule],
})
export class ResidentsModule {}
