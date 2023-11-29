import { UserDto } from '@app/users/dto/user.dto';
import { IUser } from '@app/users/interfaces/user.interface';

const toArrayFormat = (str: string, sep = ','): string[] => {
  return str ? str.split(sep).map((i) => i.trim()) : [];
};

export const userMapper = (dto: UserDto): IUser => {
  const { courses_newapp, programs_newapp, specialization_newapp, narrow_spec_newapp } = dto;
  return {
    ...dto,
    courses_newapp: toArrayFormat(courses_newapp),
    programs_newapp: toArrayFormat(programs_newapp),
    specialization_newapp: toArrayFormat(specialization_newapp),
    narrow_spec_newapp: toArrayFormat(narrow_spec_newapp),
  } as IUser;
};
