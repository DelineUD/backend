import { Types } from 'mongoose';

export interface IUser {
  _id?: Types.ObjectId;

  email: string;
  phone: number;
  password: string;
  first_name: string;
  last_name: string;
  birthday?: Date;
  avatar?: string;
  gender?: string;
  badge?: string;
  cntry?: string;
  vPass?: number;

  city_ru?: string;
  citynru?: string;

  about?: string;
  education?: string;
  qualification?: string;
  ready_communicate?: boolean;
  remote_work?: boolean;
  status?: string;

  service_cost?: number;
  site?: string;
  instagram?: string;
  telegram?: string;
  vk?: string;

  hide_phone?: boolean;
  qualification_color?: string;

  courses_newapp: string[];
  programs_newapp: string[];
  specialization_newapp: string[];
  narrow_spec_newapp: string[];
}
