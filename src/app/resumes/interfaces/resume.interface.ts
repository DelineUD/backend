import { Types } from 'mongoose';

import { IUser } from '@app/users/interfaces/user.interface';

export interface IResume {
  _id?: Types.ObjectId;

  // Resume information
  id: string;
  qualification: string[];
  narrow_spec: string[];
  remote_work: boolean;
  service_cost?: number;
  portfolio?: string;
  author: string | Types.ObjectId | IUser;
}
