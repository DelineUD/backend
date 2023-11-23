import { Types } from 'mongoose';
import { IUser } from '../../users/interfaces/user.interface';

export interface IResume {
  _id?: Types.ObjectId;

  id: string;
  title: string;
  minCost?: number;
  maxCost?: number;

  author: string | Types.ObjectId | IUser;
}
