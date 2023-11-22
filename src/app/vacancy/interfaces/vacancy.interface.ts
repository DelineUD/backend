import { AuthorStatus } from '../consts';
import { Types } from 'mongoose';
import { IUser } from '../../users/interfaces/user.interface';

export interface IVacancy {
  _id?: Types.ObjectId;

  id: string;
  title: string;
  remote: boolean;
  status: AuthorStatus;
  gender: string;
  minCost: number;
  maxCost: number;

  feedbackLink: string;
  author: string | Types.ObjectId | IUser;

  specializations: string[];
  narrowSpecializations: string[];
  programs: string[];
  courses: string[];
}
