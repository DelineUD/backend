import { Types } from 'mongoose';

import { EUserStatus } from '@shared/consts/user-status.enum';
import { EUserFormat } from '@shared/consts/user-format.enum';

export interface IContact {
  city: string;
  country?: string;
}

export interface ISocial {
  telegram?: string;
  instagram?: string;
  vk?: string;
  site?: string;
}

export interface IPreference {
  is_hide_phone: boolean;
  is_hide_birthday: boolean;
}

export interface IAdditional {
  format: EUserFormat;
  status: EUserStatus;
  qualification: string;
  about?: string;
}

export interface IBun {
  blocked_users: Types.ObjectId[];
  hidden_authors: Types.ObjectId[];
  hidden_posts: Types.ObjectId[];
}

export interface IUser {
  _id: Types.ObjectId;
  phone: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  birthday: Date;
  avatar?: string;
  contact_info: IContact;
  additional_info: IAdditional;
  bun_info?: IBun;
  preferences: IPreference;
  socials?: ISocial;
  courses?: string[];
  programs?: string[];
  specializations?: string[];
  narrow_specializations?: string[];
  is_eula_approved?: boolean;
  getcourse_id?: string;
}
