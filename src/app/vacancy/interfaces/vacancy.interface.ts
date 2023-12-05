import { Types } from 'mongoose';

import { IUser } from '@app/users/interfaces/user.interface';
import { UserPick } from '@app/users/interfaces/user-pick.interface';

export interface IVacancy {
  _id?: Types.ObjectId;

  // Vacancy information
  id: string;
  name: string;
  qualification: string[];
  narrow_spec: string[];
  need_programs: string[];
  remote_work: boolean;
  service_cost?: number;
  country?: string;
  city?: string;
  author: Types.ObjectId | Pick<IUser, UserPick>;
}
