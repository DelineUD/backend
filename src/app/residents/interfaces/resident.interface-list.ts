import { Types } from 'mongoose';

export interface IResidentList {
  _id: Types.ObjectId;
  avatar: string;
  first_name: string;
  last_name: string;
  qualification: string;
}
