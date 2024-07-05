import { UserCreateDto } from '@app/_users/dto/user-create.dto';
import { IAdditional, IContact, IPreference, ISocial, IUser } from '@app/_users/interfaces/user.interface';
import { splitDtoField } from '@helpers/splitDto';

export const createUserMapper = (dto: UserCreateDto): IUser => {
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
    ...(country && { country }),
  };

  const additional: IAdditional = {
    format,
    status,
    qualification,
    ...(about && { about }),
  };

  const preferences: IPreference = {
    is_hide_birthday,
    is_hide_phone,
  };

  const socials: ISocial = {
    ...(telegram && { telegram }),
    ...(instagram && { instagram }),
    ...(vk && { vk }),
    ...(site && { site }),
  };

  return {
    phone,
    email,
    password,
    first_name,
    last_name,
    birthday: new Date(birthday),
    ...(avatar && { avatar }),
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
