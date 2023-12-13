import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

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
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
