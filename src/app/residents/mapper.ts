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
    quality: user.service_cost,
    instagram: user.instagram,
    vk: user.vk,
    bio: user.about,
    city: user.city_ru,
    age: user.birthday,
    price: user.service_cost
  };
};
