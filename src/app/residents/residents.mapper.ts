import { IResidentList } from './interfaces/resident.interface-list';
import { IResident } from './interfaces/resident.interface';
import { IUser } from '@app/users/interfaces/user.interface';

/*
 * Function for formatting user list data before sending
 * users -> found user list
 */
export const residentListMapper = (residents: IUser[], user: Pick<IUser, '_id' | 'blocked_users'>): IResidentList[] => {
  return residents.map((r) => residentsMapper(r, { ...user }));
};

export const residentsMapper = (resident: IUser, user: Pick<IUser, '_id' | 'blocked_users'>): IResidentList => {
  const { _id, first_name, last_name, avatar, status, qualification, blocked_users } = resident;
  const youBlocked = blocked_users?.includes(user._id) ?? false;

  return {
    _id,
    first_name,
    last_name: last_name ?? 's',
    avatar: !youBlocked && avatar ? avatar : null,
    status,
    qualification: !youBlocked ? qualification : '*'.repeat(qualification.length),
  };
};

/*
 * Function for formatting user data before sending
 * residentPayload -> found user by id param
 * { _id, blocked_users } -> sender user details
 */
export const residentMapper = (resident: IUser, user: Pick<IUser, '_id' | 'blocked_users'>): IResident => {
  const {
    _id,
    first_name,
    last_name,
    phone,
    about,
    status,
    qualification,
    avatar,
    hide_phone,
    country,
    city,
    email,
    site,
    birthday,
    gender,
    instagram,
    telegram,
    programs,
    courses,
    specializations,
    narrow_specializations,
    blocked_users,
  } = resident;

  const isBlocked = user.blocked_users?.includes(_id) ?? false;
  const youBlocked = blocked_users?.includes(user._id) ?? false;

  return {
    _id,
    first_name,
    last_name: last_name ?? '',
    about: about ?? null,
    status: status ?? null,
    qualification: !youBlocked ? qualification : '*'.repeat(qualification.length),
    avatar: !youBlocked && avatar ? avatar : null,
    is_blocked: isBlocked,
    you_blocked: youBlocked,

    personal_information: {
      country,
      city,
      email,
      phone: !hide_phone ? String(phone) : null,
      site: site ?? null,
      birthday: birthday ?? null,
      gender: gender ?? null,
      instagram: !youBlocked && instagram ? instagram : null,
      telegram: !youBlocked && telegram ? telegram : null,
      contact_link: !youBlocked && telegram ? telegram : null,
    },
    description_fields: [
      {
        filed: 'Владение программами',
        items: programs,
      },
      {
        filed: 'Пройденные курсы',
        items: courses,
      },
      {
        filed: 'Специализация',
        items: specializations,
      },
      {
        filed: 'Узкая специализация',
        items: narrow_specializations,
      },
    ],
  };
};
