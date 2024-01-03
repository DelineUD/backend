import { Types } from 'mongoose';

export interface ICodes {
  _id?: Types.ObjectId;

  userId: Types.ObjectId;
  userPhone: string;
  otp: number;
}
