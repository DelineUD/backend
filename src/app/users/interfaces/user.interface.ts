import { Types } from 'mongoose';

import { EUserJobExperience } from '@shared/consts/user-experience.enum';
import { EUserJobFormat } from '@shared/consts/user-format.enum';
import { EUserProjectInvolvement } from '@shared/consts/user-involvement.enum';

export interface ILink {
  url: string;
  name?: string;
  _id?: Types.ObjectId;
}

export interface IQualification {
  name: string;
  year?: number;
}

export interface IPreference {
  is_hide_phone?: boolean;
  is_eula_approved?: boolean;
}

export interface IAdditional {
  about?: string;
  keywords?: string[];
  qualifications?: IQualification[];
  project_involvement: EUserProjectInvolvement;
  job_format: EUserJobFormat;
  job_experience: EUserJobExperience;
}

export interface IBun {
  blocked_users?: Types.ObjectId[];
  hidden_authors?: Types.ObjectId[];
  hidden_posts?: Types.ObjectId[];
}

export interface IUser {
  _id: Types.ObjectId;
  phone: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  city?: string;
  additional_info: IAdditional;
  preferences?: IPreference;
  programs?: string[];
  specializations?: string[];
  bun_info?: IBun;
  getcourse_id?: string;
}
