import { UserModel } from '../users/models/user.model';
import { IResidentList } from './interfaces/resident.interface-list';
import { IResident } from './interfaces/resident.interface';
import { allCourses, allNarrowSpecializations, allPrograms, allSpecializations } from '@shared/consts';
import { groupDtoFields } from '@helpers/groupDto';

const programsFieldsOfUser: string[] = [...allPrograms]; // Programs fields of user dto
const coursesFieldsOfUser: string[] = [...allCourses]; // Courses fields of user dto
const specFieldsOfUser: string[] = [...allSpecializations]; // Specializations fields of user dto
const narrowSpecFieldsOfUser: string[] = [...allNarrowSpecializations]; // Narrow specializations fields of user dto

export const residentListMapper = (user: UserModel[]): IResidentList[] => {
  return user.map(residentsMapper);
};

export const residentsMapper = (user: UserModel): IResidentList => {
  return {
    _id: user._id,
    avatar: user.avatar,
    first_name: user.first_name,
    last_name: user.last_name,
    status: user.status,
  };
};

export const residentMapper = (user: UserModel): IResident => {
  return {
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    about: user.about,
    status: user.status,
    avatar: user.avatar,

    personal_information: [
      {
        birthday: user.birthday,
        gender: user.gender,
        country: user.country,
        city: user.city,
      },
    ],
    description_fields: [
      {
        filed: 'Владение программами',
        items: groupDtoFields(user, programsFieldsOfUser),
      },
      {
        filed: 'Пройденные курсы',
        items: groupDtoFields(user, coursesFieldsOfUser),
      },
      {
        filed: 'Специализация',
        items: groupDtoFields(user, specFieldsOfUser),
      },
      {
        filed: 'Узкая специализация',
        items: groupDtoFields(user, narrowSpecFieldsOfUser),
      },
    ],
  };
};
