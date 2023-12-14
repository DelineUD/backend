import { IFilters, IFiltersResponse } from '@app/filters/interfaces/filters.interface';

export const filtersMapper = (
  model: IFilters[] = [],
  name = 'Фильтр',
  displayName = 'Название фильтра',
  multi = false,
): IFiltersResponse => {
  return {
    name,
    displayName,
    values: model.map((i) => ({ code: i._id, name: i.name })),
    multi,
  };
};
