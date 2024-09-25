import { Types } from 'mongoose';

import { UserEntity } from '@/app/users/entities/user.entity';
import { IBun } from '@app/users/interfaces/user.interface';

export type UserResumePickList = '_id' | 'avatar' | 'first_name' | 'last_name' | 'bun_info';
export type UserResumePick = Pick<UserEntity, UserResumePickList>;

export interface IResumeAuthor {
  _id: Types.ObjectId;
  first_name: string;
  last_name: string;
  avatar: string | null;
}

export interface IResume {
  _id?: Types.ObjectId;
  name: string;
  job_format: string;
  job_experience: string;
  specialization: string;
  contacts: string;
  city?: string;
  about?: string;
  project_involvement?: string;
  qualifications?: string[];
  programs?: string[];
  authorId: Types.ObjectId;
  author?: IResumeAuthor & { bun_info: IBun };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IResumeResponse {
  _id: Types.ObjectId;
  name: string;
  job_format: string;
  job_experience: string;
  specialization: string;
  contacts: string;
  city: string | null;
  about: string | null;
  project_involvement: string | null;
  qualifications: string[] | null;
  programs: string[] | null;
  author: IResumeAuthor | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface IResumeListItem {
  _id: Types.ObjectId;
  name: string;
  job_format: string;
  job_experience: string;
  city: string | null;
  author: IResumeAuthor | null;
  created_at?: Date;
  updated_at?: Date;
}

export type IResumeListResponse = IResumeListItem[];
