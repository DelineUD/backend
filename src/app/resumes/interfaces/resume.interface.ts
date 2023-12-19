import { Types } from 'mongoose';

import { IUser } from '@app/users/interfaces/user.interface';

export type UserResumePickList = '_id' | 'avatar' | 'first_name' | 'last_name' | 'telegram' | 'qualification';
export type UserResumePick = Pick<IUser, UserResumePickList>;

export interface IResume {
  _id?: Types.ObjectId;

  // Resume information
  id: string;
  qualification: string[];
  narrow_spec: string[];
  remote_work: boolean;
  service_cost?: number;
  portfolio?: string;
  author: Types.ObjectId | UserResumePick;
}

export interface IResumeResponse {
  _id?: Types.ObjectId;

  // Resume information
  id: string;
  qualification: string[];
  narrow_spec: string[];
  remote_work: boolean;
  service_cost?: number;
  portfolio?: string;
  author: IResumeAuthorResponse | null;
}

export interface IResumeAuthorResponse {
  _id?: Types.ObjectId;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  qualification?: string;
  contact_link?: string;
}
