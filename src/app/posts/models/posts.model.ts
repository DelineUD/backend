import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { IPosts } from '../interfaces/posts.interface';
import { GroupFilterKeys } from '@app/filters/consts';

@Schema({
  collection: 'posts',
  timestamps: true,
})
export class PostModel extends Document implements IPosts {
  @Prop({ required: true, type: Types.ObjectId, ref: 'UserModel' })
  author: Types.ObjectId;
  @Prop({ required: true })
  pText: string;
  @Prop({ required: false })
  pImg?: Array<string>;
  @Prop({ required: true })
  likes: Array<string>;
  @Prop({ required: true })
  views: Array<string>;
  @Prop({ required: true })
  group: GroupFilterKeys;
  @Prop({ required: true })
  countComments: number;
}

export const PostsSchema = SchemaFactory.createForClass(PostModel);
