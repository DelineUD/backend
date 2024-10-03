import { Types } from 'mongoose';

import { UserEntity } from '@/app/users/entities/user.entity';
import { IBun } from '@/app/users/interfaces/user.interface';

export type UserVacancyPickList = '_id' | 'avatar' | 'first_name' | 'last_name';
export type UserVacancyPick = Pick<UserEntity, UserVacancyPickList>;

export interface IVacancyAuthor {
  _id: Types.ObjectId;
  first_name: string;
  last_name: string;
  avatar: string | null;
}

export interface IVacancy {
  _id?: Types.ObjectId;
  name: string;
  job_format: string;
  job_experience: string;
  contacts: string;
  payment?: number[];
  city?: string;
  about?: string;
  project_involvement?: string;
  specializations?: string[];
  qualifications?: string[];
  programs?: string[];
  authorId: Types.ObjectId;
  author?: IVacancyAuthor & { bun_info: IBun };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IVacancyResponse {
  _id: Types.ObjectId;
  name: string;
  job_format: string;
  job_experience: string;
  contacts: string;
  payment: number[] | null;
  city: string | null;
  about: string | null;
  project_involvement: string | null;
  specializations: string[] | null;
  qualifications: string[] | null;
  programs: string[] | null;
  author: IVacancyAuthor | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface IVacancyListItem {
  _id: Types.ObjectId;
  name: string;
  job_format: string;
  job_experience: string;
  payment: number[] | null;
  city: string | null;
  project_involvement: string | null;
  author: IVacancyAuthor | null;
  created_at?: Date;
  updated_at?: Date;
}

export type IVacancyListResponse = IVacancyListItem[];
