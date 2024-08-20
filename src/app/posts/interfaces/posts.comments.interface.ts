import { Types } from 'mongoose';

import { UserEntity } from '@/app/users/entities/user.entity';
import { IPostFile } from '@app/posts/interfaces/post-file.interface';

export type UserCPostsPickList = '_id' | 'avatar' | 'first_name' | 'last_name';
export type UserCPostsPick = Pick<UserEntity, UserCPostsPickList>;

export interface ICPosts {
  _id?: Types.ObjectId;
  author: Types.ObjectId | UserCPostsPick;
  cText: string;
  countLikes: number;
  isLiked: boolean;
  likes: Array<string>;
  files?: Array<IPostFile>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICPostsResponse {
  _id: Types.ObjectId;
  author: ICPostsAuthorResponse | null;
  cText: string;
  countLikes: number;
  isLiked: boolean;
  files?: Array<IPostFile>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICPostsAuthorResponse {
  _id: Types.ObjectId | null;
  first_name: string | null;
  last_name: string | null;
  avatar: string | null;
}
