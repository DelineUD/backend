import { IVacancy, IVacancyAuthorResponse, IVacancyResponse, UserVacancyPick } from './interfaces/vacancy.interface';
import { VacancyDto } from '@app/vacancy/dto/vacancy.dto';
import { splitDtoField } from '@helpers/splitDto';

const toVacancyAuthor = (author: UserVacancyPick): IVacancyAuthorResponse => {
  return author
    ? {
        _id: author?._id ?? null,
        first_name: author?.first_name ?? null,
        last_name: author?.last_name ?? null,
        avatar: author?.avatar ?? null,
        city: author?.city ?? null,
        contact_link: author?.telegram ?? null,
      }
    : null;
};

export const vacancyDtoMapper = (dto: VacancyDto): IVacancy => {
  const { qualification, narrow_spec, need_programs, ...rest } = dto;
  return {
    ...rest,
    specializations: splitDtoField(qualification),
    narrow_specializations: splitDtoField(narrow_spec),
    programs: splitDtoField(need_programs),
  };
};

export const vacancyMapper = (payload: IVacancy): IVacancyResponse => {
  const vacancy = JSON.parse(JSON.stringify(payload)) as IVacancy;

  return {
    ...vacancy,
    author: toVacancyAuthor(vacancy.author as UserVacancyPick),
  };
};

export const vacancyListMapper = (payload: IVacancy[]): IVacancyResponse[] => {
  const vacancies = JSON.parse(JSON.stringify(payload)) as IVacancy[];

  return vacancies
    .map((vacancy) => {
      return {
        ...vacancy,
        author: toVacancyAuthor(vacancy.author as UserVacancyPick),
      };
    })
    .filter((v) => v.author);
};
