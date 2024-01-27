import { Types } from 'mongoose';

import { IUser } from '@app/users/interfaces/user.interface';

type PostUserPickList = '_id' | 'avatar' | 'first_name' | 'last_name';
export type PostUserPick = Pick<IUser, PostUserPickList>;

// TODO: Разобраться с обязательностью полей
export interface IPosts {
  _id?: Types.ObjectId;
  authorId: Types.ObjectId;
  pText: string;
  pImg?: Array<string>;
  likes: Array<string>;
  views: Array<string>;
  countComments: number;
  group: string;
  publishInProfile?: boolean;
  author?: IPostAuthorResponse;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPostsResponse {
  _id: Types.ObjectId;
  author: IPostAuthorResponse | null;
  pText: string;
  pImg: Array<string>;
  countComments: number;
  countLikes: number;
  countViews: number;
  isLiked: boolean;
  isViewed: boolean;
  group: string;
  publishInProfile: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPostAuthorResponse {
  _id?: Types.ObjectId;
  first_name?: string;
  last_name?: string;
  avatar?: string;
}
