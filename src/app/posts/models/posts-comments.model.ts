import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { ICPosts } from '../interfaces/posts.comments.interface';
import { IUser } from '@app/users/interfaces/user.interface';
import { UserPick } from '@app/users/interfaces/user-pick.interface';

@Schema({
  collection: 'posts_comments',
  timestamps: true,
})
export class PostCommentsModel extends Document implements ICPosts {
  @Prop({ required: true })
  postId: string;
  @Prop({ required: true })
  cText: string;
  @Prop({ required: false })
  cImg?: Array<string>;
  @Prop({ required: true })
  likes: Array<string>;
  @Prop({ required: true })
  countLikes: number;
  @Prop({ required: true })
  isLiked: boolean;
  @Prop({ required: true, type: Types.ObjectId, ref: 'UserModel' })
  author: Pick<IUser, UserPick>;
}

export const PostCommentsSchema = SchemaFactory.createForClass(PostCommentsModel);
