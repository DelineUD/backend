import { Types } from 'mongoose';

import { IUser } from '@app/users/interfaces/user.interface';
import { UserPick } from '@app/users/interfaces/user-pick.interface';

export interface IEvents {
  _id?: Types.ObjectId;

  author: Types.ObjectId | Pick<IUser, UserPick>;
  hText: string;
  startDate: Date;
  stopDate: Date;
  hImg?: string;
  addr?: string;
  category?: string;
  access?: string;
  bodyText?: string;
  format?: string;
  favor?: Array<string>;
  iGo?: Array<string>;
  notGo?: Array<string>;
  createdAt?: Date;
  updatedAt?: Date;
}
