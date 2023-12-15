import { FilterQuery } from 'mongoose';

import { IAllQueryFilters } from '@app/filters/interfaces/all-filters.interface';
import { FiltersService } from '@app/filters/filters.service';
import { filterQueriesMapper, filterQueryMapper } from '@app/filters/filters.mapper';

export async function getMainFilters(
  filtersService: FiltersService,
  initQuery: FilterQuery<IAllQueryFilters>,
): Promise<Partial<FilterQuery<IAllQueryFilters>>> {
  const mainQuery: Partial<FilterQuery<IAllQueryFilters>> = {};

  const { countryPromise, cityPromise, specPromises, nSpecPromises, programsPromises, coursesPromises } =
    filtersService.getFiltersPromises(initQuery);

  const [country, city, spec, narrowSpec, programs, courses] = await Promise.allSettled([
    countryPromise,
    cityPromise,
    Promise.all(specPromises),
    Promise.all(nSpecPromises),
    Promise.all(programsPromises),
    Promise.all(coursesPromises),
  ]);

  filterQueryMapper(country) && (mainQuery.country = filterQueryMapper(country));
  filterQueryMapper(city) && (mainQuery.city = filterQueryMapper(city));
  filterQueriesMapper(spec) && (mainQuery.specializations = filterQueriesMapper(spec));
  filterQueriesMapper(narrowSpec) && (mainQuery.narrow_specializations = filterQueriesMapper(narrowSpec));
  filterQueriesMapper(programs) && (mainQuery.programs = filterQueriesMapper(programs));
  filterQueriesMapper(courses) && (mainQuery.courses = filterQueriesMapper(courses));

  return { ...mainQuery };
}
