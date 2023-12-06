import { Types } from 'mongoose';

export interface IFilters {
  code?: string | Types.ObjectId;
  name: string;
}

export interface IFiltersResponse {
  name: string;
  values: IFilters[];
  multi: boolean;
}
