import { FilterQuery } from 'mongoose';

import { FiltersService } from '@app/filters/filters.service';
import { filterQueriesMapper } from '@app/filters/mappers/filters.mapper';
import { IFiltersQuery } from '@app/filters/interfaces/filtets-query.interface';

export async function profileFiltersMapper(
  filtersService: FiltersService,
  initQuery: FilterQuery<Partial<IFiltersQuery>>,
): Promise<Partial<FilterQuery<Partial<IFiltersQuery>>>> {
  const query: Partial<FilterQuery<Partial<IFiltersQuery>>> = {};

  const {
    cityPromises,
    specPromises,
    programsPromises,
    qualificationsPromises,
    jobFormatPromises,
    jobExperiencePromises,
    projectInvolvementPromises,
  } = filtersService.getFiltersPromises(initQuery);

  const [city, spec, programs, qualifications, jobFormats, jobExperienceies, projectsInvolvement] =
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

  filterQueriesMapper(qualifications) &&
    (query['additional_info.qualifications'] = filterQueriesMapper(qualifications));
  filterQueriesMapper(jobFormats) && (query['additional_info.job_format'] = filterQueriesMapper(jobFormats));
  filterQueriesMapper(jobExperienceies) &&
    (query['additional_info.job_experience'] = filterQueriesMapper(jobExperienceies));
  filterQueriesMapper(projectsInvolvement) &&
    (query['additional_info.project_involvement'] = filterQueriesMapper(projectsInvolvement));

  return query;
}
