import { Types } from 'mongoose';

import { IUser } from '@app/users/interfaces/user.interface';

export type UserVacancyPickList = '_id' | 'avatar' | 'first_name' | 'last_name' | 'telegram' | 'city';
export type UserVacancyPick = Pick<IUser, UserVacancyPickList>;

export interface IVacancy {
  _id?: Types.ObjectId;

  // Vacancy information
  id: string;
  name: string;
  author: Types.ObjectId | UserVacancyPick;
  country: string;
  city: string;
  specializations: string[];
  narrow_specializations: string[];
  programs: string[];
  remote_work?: boolean;
  service_cost?: number;
}

export interface IVacancyResponse {
  _id?: Types.ObjectId;

  // Vacancy information
  id: string;
  name: string;
  author: IVacancyAuthorResponse | null;
  country: string;
  city: string;
  specializations: string[];
  narrow_specializations: string[];
  programs: string[];
  remote_work?: boolean;
  service_cost?: number;
}

export interface IVacancyAuthorResponse {
  _id?: Types.ObjectId;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  city?: string;
  contact_link?: string;
}
