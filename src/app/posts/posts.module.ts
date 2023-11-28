import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PostCommentsModel, PostCommentsSchema } from './models/posts.comments.model';
import { PostModel, PostsSchema } from './models/posts.model';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PostModel.name,
        schema: PostsSchema,
      },
    ]),

    MongooseModule.forFeature([
      {
        name: PostCommentsModel.name,
        schema: PostCommentsSchema,
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
  controllers: [PostsController],
  providers: [PostsService, JwtStrategy, AuthService],
  exports: [PassportModule, JwtModule],
})
export class PostsModule {}
