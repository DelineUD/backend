import { Types } from 'mongoose';

// TODO: Разобраться с обязательностью полей
export interface IUser {
  _id?: Types.ObjectId; // Sys mongo id

  id: string; // Get course id
  email: string;
  phone: string;
  password: string;
  first_name: string;
  last_name?: string;
  birthday: Date;
  avatar?: string;
  gender?: string;
  badge?: string;

  country: string;
  city: string;

  about?: string;
  other?: string;
  education?: string;
  qualification?: string;
  format?: string;
  ready_communicate?: boolean;
  status: string;

  site?: string;
  instagram?: string;
  telegram?: string;
  vk?: string;

  hide_phone: boolean;
  is_eula_approved?: boolean;
  qualification_color?: string;
  blocked_users?: Types.ObjectId[];
  hidden_authors?: Types.ObjectId[];
  hidden_posts?: Types.ObjectId[];

  courses: string[];
  programs: string[];
  specializations: string[];
  narrow_specializations: string[];
}
