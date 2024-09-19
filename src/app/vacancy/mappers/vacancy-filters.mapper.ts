import { FilterQuery } from 'mongoose';

import { FiltersService } from '@app/filters/filters.service';
import { filterQueriesMapper } from '@app/filters/mappers/filters.mapper';
import { VacancyFindQueryDto } from '@app/vacancy/dto/vacancy-find-query.dto';

export async function vacancyFiltersMapper(
  filtersService: FiltersService,
  initQueryParams: FilterQuery<Partial<VacancyFindQueryDto>>,
): Promise<Partial<FilterQuery<Partial<VacancyFindQueryDto>>>> {
  const query: Partial<FilterQuery<Partial<VacancyFindQueryDto>>> = {};

  const {
    cityPromises,
    specPromises,
    programsPromises,
    qualificationsPromises,
    jobFormatPromises,
    jobExperiencePromises,
    projectInvolvementPromises,
  } = filtersService.getFiltersPromises(initQueryParams);

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

  filterQueriesMapper(city) && (query.city = filterQueriesMapper(city));
  filterQueriesMapper(spec) && (query.specialization = filterQueriesMapper(spec));
  filterQueriesMapper(programs) && (query.programs = filterQueriesMapper(programs));

  filterQueriesMapper(qualifications) && (query.qualifications = filterQueriesMapper(qualifications));
  filterQueriesMapper(jobFormats) && (query.job_format = filterQueriesMapper(jobFormats));
  filterQueriesMapper(jobExperience) && (query.job_experience = filterQueriesMapper(jobExperience));
  filterQueriesMapper(projectsInvolvement) && (query.project_involvement = filterQueriesMapper(projectsInvolvement));

  if (initQueryParams?.payment?.length) {
    query.payment = {};

    const minPayment = Number(initQueryParams.payment[0]);
    const maxPayment = Number(initQueryParams.payment[1]) ?? undefined;

    query.payment = {
      $elemMatch: {
        $gte: minPayment,
        $lte: maxPayment || Infinity,
      },
    };
  }

  return query;
}
