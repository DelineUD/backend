import { Types } from 'mongoose';

// TODO: Разобраться с обязательностью полей
export interface IUser {
  _id?: Types.ObjectId; // Sys mongo id

  id: string; // Get course id
  email: string;
  phone: string;
  password: string;
  first_name: string;
  last_name: string;
  birthday: Date;
  avatar?: string;
  gender?: string;
  badge?: string;

  country: string;
  city: string;

  about?: string;
  education?: string;
  qualification?: string;
  ready_communicate?: boolean;
  remote_work?: boolean;
  status: string;

  site?: string;
  instagram?: string;
  telegram?: string;
  vk?: string;

  hide_phone: boolean;
  qualification_color?: string;

  courses: string[];
  programs: string[];
  specializations: string[];
  narrow_specializations: string[];
}
