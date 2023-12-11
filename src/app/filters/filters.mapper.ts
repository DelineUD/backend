import { IFilters, IFiltersResponse } from '@app/filters/interfaces/filters.interface';

export const filtersMapper = (model: IFilters[] = [], name = 'Фильтр', multi = false): IFiltersResponse => {
  return {
    name,
    values: model.map((i) => ({ code: i._id, name: i.name })),
    multi,
  };
};
