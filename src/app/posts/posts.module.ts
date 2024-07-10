import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';
import { PostCommentsModel, PostCommentsSchema } from './models/posts-comments.model';
import { PostModel, PostsSchema } from './models/posts.model';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { UploadModule } from '@app/upload/upload.module';
import { ConvertModule } from '@app/converts/converts.module';

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
    forwardRef(() => UsersModule),
    UploadModule,
    ConvertModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
