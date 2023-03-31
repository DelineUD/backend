import { UserModel } from '../users/models/user.model';
import { IResident } from './interfaces/resident.interface';

export const residentListMapper = (users: UserModel[]): IResident[] => {
  return users.map(residentMapper);
};

export const residentMapper = (user: UserModel): IResident => {
  return {
    _id: user.id,

    first_name: user.first_name,

    last_name: user.last_name,

    qualification: user.qualification,

    badge: user.badge,
  };
};
