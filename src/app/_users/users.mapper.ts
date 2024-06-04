import { splitDtoField } from '@helpers/splitDto';
import { filterQueries } from '@helpers/filterQueries';
import { transformPhoneNumber } from '@utils/transformPhoneNumber';
import { IUser } from './interfaces/user.interface';
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
