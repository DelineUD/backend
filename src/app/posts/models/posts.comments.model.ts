import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { IcPosts } from '../interfaces/posts.comments.interface';

@Schema({
  collection: 'postscomments',
  timestamps: true,
})
export class PostCommentsModel extends Document implements IcPosts {
  [x: string]: any;
  @Prop({ required: true })
  postID: string;

  @Prop({ required: true })
  authorId: string;

  @Prop({ required: false })
  authorAvatar?: string;

  @Prop({ required: true })
  cText: string;

  @Prop({ required: false })
  cImg?: Array<string>;

  @Prop({ required: false })
  likes?: Array<string>;

  @Prop({ required: false })
  countLikes?: number;

  @Prop({ required: false })
  isLiked?: boolean;
}

export const PostCommentsSchema = SchemaFactory.createForClass(PostCommentsModel);
