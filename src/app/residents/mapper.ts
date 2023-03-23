import { UserModel } from '../users/models/user.model';
import { ResidentInterface } from './interfaces/resident.interface';

export const residentListMapper = (users: UserModel[]): ResidentInterface[] => {
  return users.map((user) => ({
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
  }));
};
