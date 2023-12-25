import { UserDto } from '@app/users/dto/user.dto';
import { IUser } from '@app/users/interfaces/user.interface';
import { splitDtoField } from '@helpers/splitDto';
import { transformPhoneNumber } from '@helpers/transformPhoneNumber';

export const userMapper = (dto: UserDto): IUser => {
  const { courses_new_app, programs_new_app, specialization_new_app, narrow_spec_new_app, phone, ...rest } = dto;
  return {
    ...rest,
    phone: transformPhoneNumber(phone),
    birthday: new Date(rest.birthday),
    courses: splitDtoField(courses_new_app),
    programs: splitDtoField(programs_new_app),
    specializations: splitDtoField(specialization_new_app),
    narrow_specializations: splitDtoField(narrow_spec_new_app),
  } as IUser;
};
