import { UserModel } from '../users/models/user.model';
import { IResident } from './interfaces/resident.interface';

export const residentListMapper = (users: UserModel[]): IResident[] => {
  return users.map(residentMapper);
};

export const residentMapper = (user: UserModel): IResident => {
  return {
    _id: user.id,
    phone: user.phone,
    email: user.email,
    quality: user.quality,
    instagram: user.instagram,
    vk: user.vk,
    bio: user.bio,
    city: user.city,
    age: user.age,
    price: user.price,
    readyToRemote: user.readyToRemote,
    readyToWorkNow: user.readyToWorkNow,
  };
};
