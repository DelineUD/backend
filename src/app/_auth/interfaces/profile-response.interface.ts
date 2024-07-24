import { Types } from 'mongoose';

export interface IProfileResponse {
  _id: Types.ObjectId;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  avatar: string | null;
  is_eula_approved: boolean;
}
