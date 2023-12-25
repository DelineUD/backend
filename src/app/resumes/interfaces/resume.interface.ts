import { Types } from 'mongoose';

import { IUser } from '@app/users/interfaces/user.interface';

export type UserResumePickList = '_id' | 'avatar' | 'first_name' | 'last_name' | 'telegram' | 'qualification';
export type UserResumePick = Pick<IUser, UserResumePickList>;

export interface IResume {
  _id?: Types.ObjectId; // Sys mongo id

  id: string; // Get course id
  authorId: string; // Get course user id
  qualification: string[];
  narrow_spec: string[];
  remote_work: boolean;
  service_cost?: number;
  portfolio?: string;
  author?: IResumeAuthorResponse;
}

export interface IResumeResponse {
  _id?: Types.ObjectId; // Sys mongo id

  id: string; // Get course id
  author: IResumeAuthorResponse | null;
  qualification: string[];
  narrow_spec: string[];
  remote_work: boolean;
  service_cost?: number;
  portfolio?: string;
}

export interface IResumeAuthorResponse {
  _id: Types.ObjectId | null; // Sys mongo id
  first_name: string | null;
  last_name: string | null;
  avatar: string | null;
  qualification: string | null;
  contact_link: string | null;
}
