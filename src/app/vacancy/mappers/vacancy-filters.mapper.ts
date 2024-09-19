import { FilterQuery } from 'mongoose';

import { FiltersService } from '@app/filters/filters.service';
import { filterQueriesMapper } from '@app/filters/mappers/filters.mapper';
import { VacancyFindQueryDto } from '@app/vacancy/dto/vacancy-find-query.dto';

export async function vacancyFiltersMapper(
  filtersService: FiltersService,
  { name, payment, ...baseQueries }: FilterQuery<Partial<VacancyFindQueryDto>>,
): Promise<Partial<FilterQuery<Partial<VacancyFindQueryDto>>>> {
  const queryFilter: Partial<FilterQuery<Partial<VacancyFindQueryDto>>> = {};

  name && (queryFilter.name = { $regex: new RegExp(name, 'i') });

  if (payment?.length) {
    queryFilter.payment = {};

    const minPayment = Number(payment[0]);
    const maxPayment = Number(payment[1]) ?? undefined;

    queryFilter.payment = {
      $elemMatch: {
        $gte: minPayment,
        $lte: maxPayment || Infinity,
      },
    };
  }

  const {
    cityPromises,
    specPromises,
    programsPromises,
    qualificationsPromises,
    jobFormatPromises,
    jobExperiencePromises,
    projectInvolvementPromises,
  } = filtersService.getFiltersPromises(baseQueries);

  const [city, spec, programs, qualifications, jobFormats, jobExperience, projectsInvolvement] =
    await Promise.allSettled([
      Promise.all(cityPromises),
      Promise.all(specPromises),
      Promise.all(programsPromises),
      Promise.all(qualificationsPromises),
      Promise.all(jobFormatPromises),
      Promise.all(jobExperiencePromises),
      Promise.all(projectInvolvementPromises),
    ]);

  filterQueriesMapper(city) && (queryFilter.city = filterQueriesMapper(city));
  filterQueriesMapper(spec) && (queryFilter.specialization = filterQueriesMapper(spec));
  filterQueriesMapper(programs) && (queryFilter.programs = filterQueriesMapper(programs));

  filterQueriesMapper(qualifications) && (queryFilter.qualifications = filterQueriesMapper(qualifications));
  filterQueriesMapper(jobFormats) && (queryFilter.job_format = filterQueriesMapper(jobFormats));
  filterQueriesMapper(jobExperience) && (queryFilter.job_experience = filterQueriesMapper(jobExperience));
  filterQueriesMapper(projectsInvolvement) &&
    (queryFilter.project_involvement = filterQueriesMapper(projectsInvolvement));

  return queryFilter;
}
