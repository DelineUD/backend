import { DeleteResult } from 'mongodb';
import { IVacancy } from './vacancy.interface';

export interface IRemoveVacancy extends DeleteResult {
  acknowledged: boolean;
  deletedCount: number;
  removed: IVacancy;
}
