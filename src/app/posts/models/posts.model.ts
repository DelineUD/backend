import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { GroupFilterKeys } from '@app/filters/consts';
import { IPostFile } from '@app/posts/interfaces/post-file.interface';
import { IPosts } from '../interfaces/posts.interface';

@Schema({
  collection: 'posts',
  timestamps: true,
})
export class PostModel extends Document implements IPosts {
  @Prop({ required: true })
  authorId: Types.ObjectId;
  @Prop({ required: true })
  pText: string;
  @Prop({ required: false })
  files?: IPostFile[];
  @Prop({ required: true })
  likes: Array<string>;
  @Prop({ required: true })
  views: Array<string>;
  @Prop({ required: true })
  groups: GroupFilterKeys[];
  @Prop({ required: false })
  publishInProfile?: boolean;
  @Prop({ required: true })
  countComments: number;
}

export const PostsSchema = SchemaFactory.createForClass(PostModel);

PostsSchema.virtual('author', {
  ref: 'UserModel',
  localField: 'authorId',
  foreignField: '_id',
  justOne: true,
});

PostsSchema.set('toObject', { virtuals: true });
PostsSchema.set('toJSON', { virtuals: true });
