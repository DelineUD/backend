import { IVacancy } from '@app/vacancy/interfaces/vacancy.interface';
import { VacancyUpdateDto } from '@app/vacancy/dto/vacancy-update.dto';

export const vacancyUpdateMapper = (dto: VacancyUpdateDto): Partial<IVacancy> => {
  const {
    name,
    job_experience,
    job_format,
    contacts,
    about,
    city,
    payment,
    project_involvement,
    qualifications,
    programs,
    specializations,
  } = dto;

  return {
    ...(name !== undefined && { name }),
    ...(job_experience !== undefined && { job_experience }),
    ...(job_format !== undefined && { job_format }),
    ...(contacts !== undefined && { contacts }),
    ...(about !== undefined && { about }),
    ...(city !== undefined && { city }),
    ...(payment !== undefined && { payment }),
    ...(project_involvement !== undefined && { project_involvement }),
    ...(qualifications !== undefined && { qualifications }),
    ...(programs !== undefined && { programs }),
    ...(specializations !== undefined && { specializations }),
  };
};
