import { Types } from 'mongoose';
import { UserDto } from '../users/dto/user.dto';
import { UserModel } from '../users/models/user.model';

export const toUserDto = (data: UserModel): UserDto => {
  const { _id, phone, email } = data;

  const userDto: UserDto & { _id: Types.ObjectId } = {
    _id,
    phone,
    email,
  };

  return userDto;
};
