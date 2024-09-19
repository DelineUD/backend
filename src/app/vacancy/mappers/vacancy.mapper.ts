import { UserEntity } from '@app/users/entities/user.entity';
import {
  IVacancy,
  IVacancyAuthorResponse,
  IVacancyListResponse,
  IVacancyResponse,
  UserVacancyPick,
} from '../interfaces/vacancy.interface';

const toVacancyAuthor = (author: UserVacancyPick, youBlocked: boolean): IVacancyAuthorResponse => {
  return author
    ? {
        _id: author._id,
        first_name: author.first_name,
        last_name: author.last_name,
        avatar: !youBlocked ? author?.avatar ?? null : null,
      }
    : null;
};

export const vacancyMapper = (vacancy: IVacancy, user: Pick<UserEntity, '_id' | 'bun_info'>): IVacancyResponse => {
  const {
    _id,
    name,
    job_format,
    job_experience,
    contacts,
    payment,
    specializations,
    city,
    about,
    project_involvement,
    qualifications,
    programs,
    author,
    createdAt,
    updatedAt,
  } = vacancy;

  const youBlocked = author?.bun_info?.blocked_users?.includes(user._id) ?? false;

  return {
    _id,
    name,
    job_format,
    job_experience,
    contacts,
    payment: payment ?? null,
    specializations: specializations ?? null,
    city: city ?? null,
    about: about ?? null,
    project_involvement: project_involvement ?? null,
    qualifications: qualifications ?? null,
    programs: programs ?? null,
    author: toVacancyAuthor(author as UserVacancyPick, youBlocked),
    created_at: createdAt,
    updated_at: updatedAt,
  };
};

export const vacancyListMapper = (
  vacancies: IVacancy[],
  user: Pick<UserEntity, '_id' | 'bun_info'>,
): IVacancyListResponse[] => {
  return vacancies
    .map((vacancy) => {
      const {
        _id,
        name,
        job_format,
        job_experience,
        payment,
        city,
        project_involvement,
        author,
        createdAt,
        updatedAt,
      } = vacancy;

      const youBlocked = author?.bun_info?.blocked_users?.includes(user._id) ?? false;

      return {
        _id,
        name,
        job_format,
        job_experience,
        payment: payment ?? null,
        city: city ?? null,
        project_involvement: project_involvement ?? null,
        author: toVacancyAuthor(author as UserVacancyPick, youBlocked),
        created_at: createdAt,
        updated_at: updatedAt,
      };
    })
    .filter((v) => v);
};
