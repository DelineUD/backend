import { Types } from 'mongoose';

import { UserEntity } from '@/app/users/entities/user.entity';

export type UserResumePickList = '_id' | 'avatar' | 'first_name' | 'last_name' | 'bun_info';
export type UserResumePick = Pick<UserEntity, UserResumePickList>;

export interface IResume {
  _id?: Types.ObjectId; // Sys mongo id

  id: string; // Get course id
  authorId: Types.ObjectId; // Sys user _id
  qualification: string;
  country: string;
  city: string;
  about: string;
  other?: string;
  specializations: string[];
  narrow_specializations: string[];
  format: string;
  service_cost?: number;
  portfolio?: string;
  author?: IResumeAuthorResponse & { blocked_users: Types.ObjectId[] };
  createdAt?: string;
  updatedAt?: string;
}

export interface IResumeResponse {
  _id?: Types.ObjectId; // Sys mongo id

  id: string; // Get course id
  author: IResumeAuthorResponse | null;
  qualification: string;
  country: string;
  city: string;
  about: string;
  other: string | null;
  specializations: string[];
  narrow_specializations: string[];
  format: string;
  service_cost?: number | null;
  portfolio?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IResumeAuthorResponse {
  _id: Types.ObjectId | null; // Sys mongo id
  first_name: string | null;
  last_name: string | null;
  avatar: string | null;
  qualification: string | null;
  contact_link: string | null;
}
