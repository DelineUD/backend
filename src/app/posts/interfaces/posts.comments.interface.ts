import { Types } from 'mongoose';

import { IUser } from '@app/users/interfaces/user.interface';
import { UserPick } from '@app/users/interfaces/user-pick.interface';

export interface ICPosts {
  _id?: Types.ObjectId;

  author: Pick<IUser, UserPick>;
  cText: string;
  countLikes: number;
  isLiked: boolean;
  likes: Array<string>;
  cImg?: Array<string>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICPostsResponse extends Partial<ICPosts> {
  _id: Types.ObjectId;
  author: Pick<IUser, UserPick>;
  cText: string;
  countLikes: number;
  isLiked: boolean;
  cImg?: Array<string>;
  createdAt?: Date;
  updatedAt?: Date;
}
