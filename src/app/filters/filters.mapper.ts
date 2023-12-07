import { IFilters, IFiltersResponse } from '@app/filters/interfaces/filters.interface';

export const filtersMapper = (model: IFilters[] = [], name = 'Отфильтровать по', multi = false): IFiltersResponse => {
  return {
    name,
    values: model.map((i) => ({ code: i.code, name: i.name })),
    multi,
  };
};