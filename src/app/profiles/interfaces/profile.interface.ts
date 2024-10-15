import { IEducation, ILink, IQualification } from '@app/users/interfaces/user.interface';
import { EUserProjectInvolvement } from '@shared/consts/user-involvement.enum';
import { EUserJobFormat } from '@shared/consts/user-format.enum';
import { EUserJobExperience } from '@shared/consts/user-experience.enum';

export interface IProfileEducation {
  additional_education: IEducation[] | null;
  qualifications: IQualification[] | null;
  programs: string[] | null;
}

export interface IProfilePersonalInformation {
  about: string | null;
  city: string | null;
  keywords: string[];
  links: Array<ILink> | null;
  education: IProfileEducation | null;
  specialization: string | null;
  job_format: EUserJobFormat | null;
  job_experience: EUserJobExperience | null;
  project_involvement: EUserProjectInvolvement | null;
  is_hide_phone: boolean;
}

export interface IProfileResponse {
  _id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  avatar: string | null;
  personal_information: IProfilePersonalInformation | null;
  is_blocked?: boolean;
  you_blocked?: boolean;
}
