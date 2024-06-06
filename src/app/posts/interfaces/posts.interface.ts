import { Types } from 'mongoose';

import { IUser } from '@app/users/interfaces/user.interface';
import { GroupFilterKeys } from '@app/filters/consts';

type PostUserPickList = '_id' | 'avatar' | 'first_name' | 'last_name' | 'blocked_users';
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
  groups: GroupFilterKeys[];
  publishInProfile?: boolean;
  author?: IPostAuthorResponse & { blocked_users: Types.ObjectId[] };
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
  groups: GroupFilterKeys[];
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
