import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { ICPosts } from '../interfaces/posts.comments.interface';
import { IUser } from '@app/users/interfaces/user.interface';

@Schema({
  collection: 'postscomments',
  timestamps: true,
})
export class PostCommentsModel extends Document implements ICPosts {
  [x: string]: any;

  @Prop({ required: true })
  postId: string;
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
  @Prop({ required: true, type: Types.ObjectId, ref: 'UserModel' })
  author: string | Types.ObjectId | IUser;
}

export const PostCommentsSchema = SchemaFactory.createForClass(PostCommentsModel);
