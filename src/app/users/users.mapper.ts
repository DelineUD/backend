import { IUser } from '@app/users/interfaces/user.interface';
import { transformPhoneNumber } from '@utils/transformPhoneNumber';
import { splitDtoField } from '@helpers/splitDto';
import { filterQueries } from '@helpers/filterQueries';
import { CreateUserDto } from '@app/users/dto/user-create.dto';

export const userMapper = (dto: Omit<CreateUserDto, 'password'>): IUser => {
  const {
    courses_new_app,
    programs_new_app,
    specialization_new_app,
    narrow_spec_new_app,
    phone,
    birthday,
    ...userRest
  } = dto;
  const filteredUserDto = filterQueries(userRest) as IUser;

  return {
    ...filteredUserDto,
    phone: transformPhoneNumber(phone),
    birthday: new Date(birthday?.split('.').reverse().join('-')),
    courses: splitDtoField(courses_new_app),
    programs: splitDtoField(programs_new_app),
    specializations: splitDtoField(specialization_new_app),
    narrow_specializations: splitDtoField(narrow_spec_new_app),
  };
};
