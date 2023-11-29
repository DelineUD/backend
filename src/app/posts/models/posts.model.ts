import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { IPosts } from '../interfaces/posts.interface';
import { IUser } from '@app/users/interfaces/user.interface';

@Schema({
  collection: 'posts',
  timestamps: true,
})
export class PostModel extends Document implements IPosts {
  [x: string]: any;

  @Prop({ required: true, type: Types.ObjectId, ref: 'UserModel' })
  author: string | Types.ObjectId | IUser;

  @Prop({ required: true })
  pText: string;

  @Prop({ required: false })
  pImg?: Array<string>;

  @Prop({ required: false })
  likes?: Array<string>;

  @Prop({ required: false })
  views: Array<string>;

  @Prop({ required: false })
  group: string;

  @Prop({ required: false })
  countLikes: number;

  @Prop({ required: false })
  isLiked?: boolean;

  @Prop({ required: false })
  countComments: number;
}

export const PostsSchema = SchemaFactory.createForClass(PostModel);
