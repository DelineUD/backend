import { Types } from 'mongoose';

import { IUser } from '@app/users/interfaces/user.interface';

export interface IPosts {
  _id?: Types.ObjectId;

  author?: string | Types.ObjectId | IUser;
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
