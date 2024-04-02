import { Types } from 'mongoose';

import { ComplaintTypes } from '@app/complaints/consts';

export interface IComplaint {
  _id?: Types.ObjectId;

  type: ComplaintTypes;
  id: Types.ObjectId;
  authorId: Types.ObjectId;
  reason: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IComplaintsResponse {
  code: string;
  name: string;
}
