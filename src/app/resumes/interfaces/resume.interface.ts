import { Types } from 'mongoose';

import { IUser } from '@app/users/interfaces/user.interface';
import { UserPick } from '@app/users/interfaces/user-pick.interface';

export interface IResume {
  _id?: Types.ObjectId;

  // Resume information
  id: string;
  qualification: string[];
  narrow_spec: string[];
  remote_work: boolean;
  service_cost?: number;
  portfolio?: string;
  author: Types.ObjectId | Pick<IUser, UserPick>;
}
