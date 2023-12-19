import { Types } from 'mongoose';

import { IUser } from '@app/users/interfaces/user.interface';

type PostUserPickList = '_id' | 'avatar' | 'first_name' | 'last_name';
export type PostUserPick = Pick<IUser, PostUserPickList>;

// TODO: Разобраться с обязательностью полей
export interface IPosts {
  _id?: Types.ObjectId;

  author?: Types.ObjectId | PostUserPick;
  pText?: string;
  pImg?: Array<string>;
  likes?: Array<string>;
  views?: Array<string>;
  views_count?: number;
  isViewed?: boolean;
  group?: string;
  countLikes?: number;
  countComments?: number;
  isLiked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPostsResponse {
  _id: Types.ObjectId;
  author: IPostAuthorResponse | null;
  pText: string;
  pImg: Array<string>;
  countComments?: number;
  countLikes: number;
  views_count: number;
  isLiked: boolean;
  isViewed: boolean;
  group: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPostAuthorResponse {
  _id?: Types.ObjectId;
  first_name?: string;
  last_name?: string;
  avatar?: string;
}
