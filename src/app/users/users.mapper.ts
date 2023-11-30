import { UserDto } from '@app/users/dto/user.dto';
import { IUser } from '@app/users/interfaces/user.interface';
import { splitDtoField } from '@helpers/splitDto';

export const userMapper = (dto: UserDto): IUser => {
  const { courses_new_app, programs_new_app, specialization_new_app, narrow_spec_new_app, ...rest } = dto;
  return {
    ...rest,
    courses_new_app: splitDtoField(courses_new_app),
    programs_new_app: splitDtoField(programs_new_app),
    specialization_new_app: splitDtoField(specialization_new_app),
    narrow_spec_new_app: splitDtoField(narrow_spec_new_app),
  } as IUser;
};
