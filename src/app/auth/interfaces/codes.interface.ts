import { Types } from 'mongoose';

export interface ICodes {
  _id?: Types.ObjectId;
  user_phone: string;
  otp: number;
}
