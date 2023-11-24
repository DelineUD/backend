import { DeleteResult } from 'mongodb';

export interface IRemoveEntity<T> extends DeleteResult {
  acknowledged: boolean;
  deletedCount: number;
  removed: T;
}
