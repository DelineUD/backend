import { UserEntity } from '../users/entities/user.entity';
import { IResident } from './interfaces/resident.interface';
import { IResidentList } from './interfaces/resident.interface-list';

/*
 * Function for formatting user list data before sending
 * users -> found user list
 */
export const residentListMapper = (
  residents: UserEntity[],
  user: Pick<UserEntity, '_id' | 'bun_info'>,
): IResidentList[] => {
  return residents.map((r) => residentsMapper(r, { ...user }));
};

export const residentsMapper = (resident: UserEntity, user: Pick<UserEntity, '_id' | 'bun_info'>): IResidentList => {
  const { _id, first_name, last_name, avatar, bun_info } = resident;
  const youBlocked = bun_info?.blocked_users?.includes(user._id) ?? false;

  return {
    _id,
    first_name,
    last_name: last_name ?? 's',
    avatar: !youBlocked && avatar ? avatar : null,
    qualification: '*'.repeat(5),
  };
};

/*
 * Function for formatting user data before sending
 * residentPayload -> found user by id param
 * { _id, blocked_users } -> sender user details
 */
export const residentMapper = (resident: UserEntity, user: Pick<UserEntity, '_id' | 'bun_info'>): IResident => {
  const { _id, first_name, last_name, phone, avatar, city, email, programs, specializations, bun_info } = resident;

  const isBlocked = user.bun_info?.blocked_users?.includes(_id) ?? false;
  const youBlocked = bun_info?.blocked_users?.includes(user._id) ?? false;

  return {
    _id,
    first_name,
    last_name: last_name ?? '',
    about: null,
    status: null,
    qualification: '*'.repeat(5),
    other: null,
    format: null,
    avatar: !youBlocked && avatar ? avatar : null,
    is_blocked: isBlocked,
    you_blocked: youBlocked,

    personal_information: {
      country: null,
      city,
      email,
      phone: String(phone),
      site: null,
      birthday: null,
      gender: null,
      instagram: null,
      telegram: null,
      contact_link: null,
    },
    description_fields: [
      {
        filed: 'Владение программами',
        items: programs,
      },
      {
        filed: 'Пройденные курсы',
        items: [],
      },
      {
        filed: 'Специализация',
        items: specializations,
      },
      {
        filed: 'Узкая специализация',
        items: [],
      },
    ],
  };
};
