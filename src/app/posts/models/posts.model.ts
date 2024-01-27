import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { IPosts } from '../interfaces/posts.interface';
import { GroupFilterKeys } from '@app/filters/consts';
import { VacancySchema } from '@app/vacancy/entities/vacancy.entity';

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
  pImg?: Array<string>;
  @Prop({ required: true })
  likes: Array<string>;
  @Prop({ required: true })
  views: Array<string>;
  @Prop({ required: true })
  group: GroupFilterKeys;
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
