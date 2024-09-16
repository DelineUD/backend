import { FilterQuery } from 'mongoose';

import { FiltersService } from '@app/filters/filters.service';
import { filterQueriesMapper } from '@app/filters/mappers/filters.mapper';
import { IFiltersQuery } from '@app/filters/interfaces/filtets-query.interface';

export async function getMainFilters(
  filtersService: FiltersService,
  initQuery: FilterQuery<IFiltersQuery>,
): Promise<Partial<FilterQuery<IFiltersQuery>>> {
  const mainQuery: Partial<FilterQuery<IFiltersQuery>> = {};

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

  filterQueriesMapper(city) && (mainQuery.city = filterQueriesMapper(city));
  filterQueriesMapper(spec) && (mainQuery.specialization = filterQueriesMapper(spec));
  filterQueriesMapper(programs) && (mainQuery.programs = filterQueriesMapper(programs));

  filterQueriesMapper(qualifications) &&
    (mainQuery['additional_info.qualifications'] = filterQueriesMapper(qualifications));
  filterQueriesMapper(jobFormats) && (mainQuery['additional_info.job_format'] = filterQueriesMapper(jobFormats));
  filterQueriesMapper(jobExperienceies) &&
    (mainQuery['additional_info.job_experience'] = filterQueriesMapper(jobExperienceies));
  filterQueriesMapper(projectsInvolvement) &&
    (mainQuery['additional_info.project_involvement'] = filterQueriesMapper(projectsInvolvement));

  return { ...mainQuery };
}
