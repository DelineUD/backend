import { VacancyDto } from './dto/vacancy.dto';
import { IVacancy } from './interfaces/vacancy.interface';

import { groupDtoFields } from '../shared/helpers/groupDto';
import {
  allCourses,
  allNarrowSpecializations,
  allPrograms,
  allSpecializations,
} from '../shared/consts';

export const vacancyMapper = (dto: VacancyDto): IVacancy => {
  return {
    id: dto.id,
    title: dto.title,
    remote: !!dto.remote,
    status: dto.status,
    gender: dto.gender,
    minCost: dto.minCost,
    maxCost: dto.maxCost,

    feedbackLink: dto.feedbackLink,
    authorId: dto.authorId,

    specializations: groupDtoFields(dto, allSpecializations),
    narrowSpecializations: groupDtoFields(dto, allNarrowSpecializations),
    programs: groupDtoFields(dto, allPrograms),
    courses: groupDtoFields(dto, allCourses),
  };
};
