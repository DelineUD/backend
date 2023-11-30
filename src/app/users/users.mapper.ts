import { UserDto } from '@app/users/dto/user.dto';
import { IUser } from '@app/users/interfaces/user.interface';
import { splitDtoField } from '@helpers/splitDto';

export const userMapper = (dto: UserDto): IUser => {
  const { courses_newapp, programs_newapp, specialization_newapp, narrow_spec_newapp, ...rest } = dto;
  return {
    ...rest,
    courses_newapp: splitDtoField(courses_newapp),
    programs_newapp: splitDtoField(programs_newapp),
    specialization_newapp: splitDtoField(specialization_newapp),
    narrow_spec_newapp: splitDtoField(narrow_spec_newapp),
  } as IUser;
};
