import { Types } from 'mongoose';

export interface INormalizeDto {
  authorId: Types.ObjectId; // Sys user _id
  id: string;
}
