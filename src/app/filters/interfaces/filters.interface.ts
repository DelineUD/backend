import { Types } from 'mongoose';

export interface IFilter {
  _id?: Types.ObjectId;
  name: string;
}

export interface IFiltersValue {
  code: string;
  name: string;
}

export interface IFiltersResponse {
  name: string;
  displayName: string;
  values: IFiltersValue[];
  multi: boolean;
}
