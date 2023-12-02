import { Types } from 'mongoose';

import { IUser } from '@app/users/interfaces/user.interface';

export interface ICPosts {
  _id?: Types.ObjectId;

  author: string | Types.ObjectId | IUser;
  cText: string;
  likes?: Array<string>;
  countLikes?: number;
  isLiked?: boolean;
  cImg?: Array<string>;
  createdAt?: Date;
  updatedAt?: Date;
}
