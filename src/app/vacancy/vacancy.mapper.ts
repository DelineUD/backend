import { VacancyDto } from '@app/vacancy/dto/vacancy.dto';
import { UserEntity } from '../users/entities/user.entity';
import { IVacancy, IVacancyAuthorResponse, IVacancyResponse, UserVacancyPick } from './interfaces/vacancy.interface';

const toVacancyAuthor = (author: UserVacancyPick, youBlocked: boolean): IVacancyAuthorResponse => {
  return author
    ? {
        _id: author?._id ?? null,
        first_name: author?.first_name ?? null,
        last_name: author?.last_name ?? null,
        avatar: !youBlocked ? author?.avatar ?? null : null,
        city: author?.city ?? null,
        contact_link: null,
      }
    : null;
};

/*
 * Function for transferring data from get course api
 */
export const vacancyDtoMapper = (dto: VacancyDto): IVacancy => {
  const { spec, narrow_spec, need_programs, ...rest } = dto;
  return {
    ...rest,
    specializations: spec,
    narrow_specializations: narrow_spec,
    programs: need_programs,
  };
};

/*
 * Function for formatting vacancy data before sending
 * user -> found user
 */
export const vacancyMapper = (vacancy: IVacancy, user: Pick<UserEntity, '_id' | 'bun_info'>): IVacancyResponse => {
  if (!vacancy.author) {
    return null;
  }

  const {
    _id,
    id,
    name,
    country,
    city,
    about,
    other,
    specializations,
    narrow_specializations,
    programs,
    format,
    service_cost,
    author,
    createdAt,
    updatedAt,
  } = vacancy;

  const youBlocked = author.bun_info?.blocked_users?.includes(user._id) ?? false;

  return {
    _id,
    id,
    name,
    country,
    city,
    about,
    other,
    specializations,
    narrow_specializations,
    programs,
    format,
    service_cost: service_cost ?? null,
    author: toVacancyAuthor(author as UserVacancyPick, youBlocked),
    createdAt: String(createdAt),
    updatedAt: String(updatedAt),
  };
};

/*
 * Function for formatting vacancy list data before sending
 * user -> found user
 */
export const vacancyListMapper = (
  vacancies: IVacancy[],
  user: Pick<UserEntity, '_id' | 'bun_info'>,
): IVacancyResponse[] => {
  return vacancies.map((v) => vacancyMapper(v, user)).filter((v) => v);
};
