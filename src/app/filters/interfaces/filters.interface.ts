import { Types } from 'mongoose';

export interface IFilters {
  _id?: Types.ObjectId;
  name: string;
}

export interface IFiltersResponse {
  name: string;
  values: IFilters[];
  multi: boolean;
}
