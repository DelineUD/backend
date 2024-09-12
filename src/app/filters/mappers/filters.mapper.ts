import { IFilter, IFiltersResponse } from '@app/filters/interfaces/filters.interface';

export const filtersMapper = (
  model: IFilter[] = [],
  name = 'Фильтр',
  displayName = 'Название фильтра',
  multi = false,
): IFiltersResponse => {
  return {
    name,
    displayName,
    values: model.map((i) => ({ code: String(i._id), name: i.name })),
    multi,
  };
};

export const filterQueryMapper = (queryParam: PromiseSettledResult<IFilter>): string => {
  if (queryParam.status === 'rejected') {
    return;
  }
  return queryParam.value?.name;
};

export const filterQueriesMapper = (queryParam: PromiseSettledResult<IFilter[]>, allMatch = false) => {
  if (queryParam.status === 'rejected') {
    return;
  }
  const arrQueries = queryParam.value?.reduce((acc, i) => i && [...acc, i.name], []) ?? [];
  return !allMatch && !arrQueries.length ? arrQueries : { $in: arrQueries };
};
