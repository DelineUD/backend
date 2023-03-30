import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IPosts } from '../interfaces/posts.interface';

@Schema({ collection: 'posts', timestamps: true })
export class PostModel extends Document implements IPosts {

  @Prop({ required: true })
  authorId: string;

  @Prop({ required: true })
  cDate: string;

  @Prop({ required: true })
  pText: string;

  @Prop({ required: false })
  stick: string;

  @Prop({ required: false })
  pImg: string;

  @Prop({ required: false })
  likes: number;
  
  @Prop({ required: false })
  views: number;

  @Prop({ required: false })
  group: string;

}

export const PostsSchema = SchemaFactory.createForClass(PostModel);