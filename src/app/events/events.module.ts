import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventsModel, EventsSchema } from './models/events.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: EventsModel.name,
        schema: EventsSchema,
      },
    ]),
    AuthModule,
    UsersModule,
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
  ],
  providers: [EventsService, JwtStrategy, AuthService],
  controllers: [EventsController],
  exports: [PassportModule, JwtModule],
})
export class EventsModule {}