import { IVacancy } from './interfaces/vacancy.interface';
import { VacancyDto } from '@app/vacancy/dto/vacancy.dto';
import { splitDtoField } from '@helpers/splitDto';

export const vacancyMapper = (dto: VacancyDto): IVacancy => {
  const { qualification, narrow_spec, need_programs, ...rest } = dto;
  return {
    ...rest,
    qualification: splitDtoField(qualification),
    narrow_spec: splitDtoField(narrow_spec),
    need_programs: splitDtoField(need_programs),
  };
};
