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
  vPass?: number;

  country?: string;
  city?: string;

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

  courses_new_app: string[];
  programs_new_app: string[];
  specialization_new_app: string[];
  narrow_spec_new_app: string[];
}
