import { Types } from 'mongoose';

import { UserDto } from '../dto/user.dto';

export interface IUser extends UserDto {
  _id?: Types.ObjectId;
}
