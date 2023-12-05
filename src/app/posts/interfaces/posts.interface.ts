import { Types } from 'mongoose';

import { IUser } from '@app/users/interfaces/user.interface';

type UserPick = '_id' | 'avatar' | 'first_name' | 'last_name';

export interface IPosts {
  _id?: Types.ObjectId;

  author?: Pick<IUser, UserPick>;
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
