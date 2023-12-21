import { Types } from 'mongoose';

import { IUser } from '@app/users/interfaces/user.interface';

export type UserCPostsPickList = '_id' | 'avatar' | 'first_name' | 'last_name';
export type UserCPostsPick = Pick<IUser, UserCPostsPickList>;

export interface ICPosts {
  _id?: Types.ObjectId;

  author: Types.ObjectId | UserCPostsPick;
  cText: string;
  countLikes: number;
  isLiked: boolean;
  likes: Array<string>;
  cImg?: Array<string>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICPostsResponse {
  _id: Types.ObjectId;
  author: ICPostsAuthorResponse | null;
  cText: string;
  countLikes: number;
  isLiked: boolean;
  cImg?: Array<string>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICPostsAuthorResponse {
  _id: Types.ObjectId | null;
  first_name: string | null;
  last_name: string | null;
  avatar: string | null;
}
