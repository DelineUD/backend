import { Types } from 'mongoose';

export interface IFilters {
  _id?: string | Types.ObjectId;
  name: string;
}

export interface IFiltersValue {
  code: string | Types.ObjectId;
  name: string;
}

export interface IFiltersResponse {
  name: string;
  values: IFiltersValue[];
  multi: boolean;
}
