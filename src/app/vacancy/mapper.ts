import { IVacancy } from './interfaces/vacancy.interface';

import { groupDtoFields } from '../shared/helpers/groupDto';
import {
  allCourses,
  allNarrowSpecializations,
  allPrograms,
  allSpecializations,
} from '../shared/consts';
import { CreateVacancyDto } from './dto/create-vacancy.dto';

export const vacancyMapper = (dto: CreateVacancyDto): IVacancy => {
  return {
    id: dto.id,
    title: dto.title,
    remote: !!dto.remote,
    status: dto.status,
    gender: dto.gender,
    minCost: dto.minCost,
    maxCost: dto.maxCost,

    feedbackLink: dto.feedbackLink,
    author: dto.author,

    specializations: groupDtoFields(dto, allSpecializations),
    narrowSpecializations: groupDtoFields(dto, allNarrowSpecializations),
    programs: groupDtoFields(dto, allPrograms),
    courses: groupDtoFields(dto, allCourses),
  };
};
