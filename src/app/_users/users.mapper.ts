import { splitDtoField } from '@helpers/splitDto';
import { filterQueries } from '@helpers/filterQueries';
import { transformPhoneNumber } from '@utils/transformPhoneNumber';
import { IAdditional, IBun, IContact, IPreference, ISocial, IUser } from './interfaces/user.interface';
import { UserCreateDto } from './dto/user-create.dto';

export const userMapper = (dto: Omit<UserCreateDto, 'password'>): IUser => {
  const { courses, programs, specializations, narrow_specializations, phone, birthday, ...userRest } = dto;
  const filteredUserDto = filterQueries(userRest) as IUser;

  return {
    ...filteredUserDto,
    phone: transformPhoneNumber(phone),
    birthday: new Date(birthday?.split('.').reverse().join('-')),
    courses: splitDtoField(courses),
    programs: splitDtoField(programs),
    specializations: splitDtoField(specializations),
    narrow_specializations: splitDtoField(narrow_specializations),
  };
};

export const createUserMapper = (dto: UserCreateDto): Omit<IUser, '_id'> => {
  const {
    phone,
    email,
    password,
    first_name,
    last_name,
    birthday,
    city,
    country,
    status,
    format,
    qualification,
    avatar,
    about,
    telegram,
    instagram,
    vk,
    site,
    is_hide_phone,
    is_hide_birthday,
    courses,
    programs,
    specializations,
    narrow_specializations,
  } = dto;

  const contacts: IContact = {
    city,
    country: country ?? undefined,
  };

  const additional: IAdditional = {
    format,
    status,
    qualification,
    about: about ?? undefined,
  };

  const preferences: IPreference = {
    is_hide_birthday,
    is_hide_phone,
  };

  const socials: ISocial = {
    telegram: telegram ?? undefined,
    instagram: instagram ?? undefined,
    vk: vk ?? undefined,
    site: site ?? undefined,
  };

  return {
    phone,
    email,
    password,
    first_name,
    last_name,
    birthday: new Date(birthday),
    avatar: avatar || undefined,
    contact_info: contacts,
    additional_info: additional,
    preferences: preferences,
    socials: socials,
    courses: splitDtoField(courses) ?? [],
    programs: splitDtoField(programs) ?? [],
    specializations: splitDtoField(specializations) ?? [],
    narrow_specializations: splitDtoField(narrow_specializations) ?? [],
    is_eula_approved: false,
  };
};
