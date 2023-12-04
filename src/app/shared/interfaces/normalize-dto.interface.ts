import { Types } from 'mongoose';

export interface INormalizeDto {
  author: Types.ObjectId;
  id: string;
}
