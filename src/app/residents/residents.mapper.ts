import { IResidentList } from './interfaces/resident.interface-list';
import { IResident } from './interfaces/resident.interface';
import { IUser } from '@app/users/interfaces/user.interface';

export const residentListMapper = (user: IUser[]): IResidentList[] => {
  return user.map(residentsMapper);
};

export const residentsMapper = (user: IUser): IResidentList => {
  const { ...userPayload } = JSON.parse(JSON.stringify(user)) as IUser;
  return {
    _id: userPayload._id,
    first_name: userPayload.first_name,
    last_name: userPayload.last_name,
    avatar: userPayload.avatar ?? null,
    status: userPayload.status ?? null,
    qualification: userPayload.qualification ?? null,
  };
};

export const residentMapper = (user: IUser): IResident => {
  const { hide_phone, ...userPayload } = JSON.parse(JSON.stringify(user)) as IUser;
  return {
    _id: userPayload._id,
    first_name: userPayload.first_name,
    last_name: userPayload.last_name,
    about: userPayload.about ?? null,
    status: userPayload.status ?? null,
    qualification: userPayload.qualification ?? null,
    avatar: userPayload.avatar ?? null,

    personal_information: {
      country: userPayload.country,
      city: userPayload.city,
      email: userPayload.email,
      phone: !hide_phone ? String(user.phone) : null,
      site: userPayload.site ?? null,
      birthday: userPayload.birthday ?? null,
      gender: userPayload.gender ?? null,
      instagram: userPayload.instagram ?? null,
      telegram: userPayload.telegram ?? null,
      contact_link: userPayload.telegram ?? null,
    },
    description_fields: [
      {
        filed: 'Владение программами',
        items: userPayload.programs,
      },
      {
        filed: 'Пройденные курсы',
        items: userPayload.courses,
      },
      {
        filed: 'Специализация',
        items: userPayload.specializations,
      },
      {
        filed: 'Узкая специализация',
        items: userPayload.narrow_specializations,
      },
    ],
  };
};
