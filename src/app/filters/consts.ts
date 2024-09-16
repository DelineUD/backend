import { EUserJobExperience } from '@shared/consts/user-experience.enum';
import { EUserJobFormat } from '@shared/consts/user-format.enum';
import { EUserProjectInvolvement } from '@shared/consts/user-involvement.enum';
import { EUserQualification } from '@shared/consts/user-qualification.enum';
import { EPostGroup } from '@shared/consts/post-group.enum';

export enum FilterKeys {
  City = 'city',
  Spec = 'specialization',
  Programs = 'programs',
  Experience = 'job_experience',
  Format = 'job_format',
  Qualifications = 'qualifications',
  Involvement = 'project_involvement',
  Group = 'group',
  Desc = 'desc',
}

export enum FilterNames {
  City = 'Город',
  Spec = 'Специализация',
  Programs = 'Программы',
  Experience = 'Опыт работы',
  Format = 'Формат работы',
  Qualifications = 'Квалификация',
  Involvement = 'Участие в проектах',
  Group = 'Группа',
}

export const groupFilters = Object.values(EPostGroup).map((value) => ({ name: value }));

export const jobExperienceFilters = Object.values(EUserJobExperience).map((value) => ({ name: value }));

export const jobFormatFilters = Object.values(EUserJobFormat).map((value) => ({ name: value }));

export const projectInvolvementFilters = Object.values(EUserProjectInvolvement).map((value) => ({ name: value }));

export const qualificationsFilters = Object.values(EUserQualification).map((value) => ({ name: value }));
