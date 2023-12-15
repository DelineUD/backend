import { Types } from 'mongoose';

import { IUser } from '@app/users/interfaces/user.interface';
import { UserPick } from '@app/users/interfaces/user-pick.interface';

export interface IVacancy {
  _id?: Types.ObjectId;

  // Vacancy information
  id: string;
  name: string;
  author: Types.ObjectId | Pick<IUser, UserPick>;
  country: string;
  city: string;
  specializations: string[];
  narrow_specializations: string[];
  programs: string[];
  remote_work?: boolean;
  service_cost?: number;
}
