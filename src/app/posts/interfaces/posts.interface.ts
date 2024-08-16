import { Types } from 'mongoose';

import { IBun, IUser } from '@/app/users/interfaces/user.interface';
import { GroupFilterKeys } from '@app/filters/consts';
import { IPostFile } from '@app/posts/interfaces/post-file.interface';

type PostUserPickList = '_id' | 'avatar' | 'first_name' | 'last_name' | 'bun_info';
export type PostUserPick = Pick<IUser, PostUserPickList>;

// TODO: Разобраться с обязательностью полей
export interface IPosts {
  _id?: Types.ObjectId;
  authorId: Types.ObjectId;
  pText: string;
  files?: IPostFile[];
  likes: Array<string>;
  views: Array<string>;
  countComments: number;
  groups: GroupFilterKeys[];
  publishInProfile?: boolean;
  author?: IPostAuthorResponse & { bun_info: IBun };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPostsResponse {
  _id: Types.ObjectId;
  author: IPostAuthorResponse | null;
  pText: string;
  files?: IPostFile[];
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
