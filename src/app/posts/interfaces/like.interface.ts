import { Types } from 'mongoose';

export interface ILike {
  _id: Types.ObjectId;
  countLikes: number;
  isLiked: boolean;
}
