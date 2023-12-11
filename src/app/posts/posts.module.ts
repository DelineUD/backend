import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { UsersModule } from '../users/users.module';
import { PostCommentsModel, PostCommentsSchema } from './models/posts-comments.model';
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
  ],
  controllers: [PostsController],
  providers: [PostsService, AuthService],
})
export class PostsModule {}
