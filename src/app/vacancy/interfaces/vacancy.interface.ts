import { Types } from 'mongoose';

import { IUser } from '@app/users/interfaces/user.interface';

export type UserVacancyPickList = '_id' | 'avatar' | 'first_name' | 'last_name' | 'telegram' | 'city';
export type UserVacancyPick = Pick<IUser, UserVacancyPickList>;

export interface IVacancy {
  _id?: Types.ObjectId;

  id: string; // Get course id
  authorId: string;
  name: string;
  country: string;
  city: string;
  about: string;
  specializations: string[];
  narrow_specializations: string[];
  programs: string[];
  remote_work: boolean;
  service_cost?: number;
  author?: IVacancyAuthorResponse;
  createdAt?: string;
  updatedAt?: string;
}

export interface IVacancyResponse {
  _id?: Types.ObjectId; // Sys mongo _id

  id: string; // Get course id
  name: string;
  author: IVacancyAuthorResponse;
  country: string;
  city: string;
  about: string;
  specializations: string[];
  narrow_specializations: string[];
  programs: string[];
  remote_work: boolean;
  service_cost: number;
  createdAt: string;
  updatedAt: string;
}

export interface IVacancyAuthorResponse {
  _id: Types.ObjectId | null; // Sys mongo _id
  first_name: string | null;
  last_name: string | null;
  avatar: string | null;
  city: string | null;
  contact_link: string | null;
}
