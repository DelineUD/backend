import { Types } from 'mongoose';

import { PostUserPick } from '@/app/posts/interfaces/posts.interface';

export interface IEvents {
  _id?: Types.ObjectId;

  author: Types.ObjectId | PostUserPick;
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
