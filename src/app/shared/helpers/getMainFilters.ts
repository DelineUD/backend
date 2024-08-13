import { FilterQuery } from 'mongoose';

import { IAllQueryFilters } from '@app/filters/interfaces/all-filters.interface';
import { FiltersService } from '@app/filters/filters.service';
import { filterQueriesMapper, filterQueryMapper } from '@app/filters/filters.mapper';

export async function getMainFilters(
  filtersService: FiltersService,
  initQuery: FilterQuery<IAllQueryFilters>,
): Promise<Partial<FilterQuery<IAllQueryFilters>>> {
  const mainQuery: Partial<FilterQuery<IAllQueryFilters>> = {};

  const { cityPromise, specPromises, programsPromises } =
    filtersService.getFiltersPromises(initQuery);

  const [city, spec, programs] = await Promise.allSettled([
    cityPromise,
    Promise.all(specPromises),
    Promise.all(programsPromises),
  ]);

  filterQueryMapper(city) && (mainQuery.city = filterQueryMapper(city));
  filterQueriesMapper(spec) && (mainQuery.specializations = filterQueriesMapper(spec));
  filterQueriesMapper(programs) && (mainQuery.programs = filterQueriesMapper(programs));

  return { ...mainQuery };
}
