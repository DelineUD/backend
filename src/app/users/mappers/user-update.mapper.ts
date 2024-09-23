import { UserUpdateDto } from '@app/users/dto/user-update.dto';
import { IAdditional, IPreference, IUser } from '@app/users/interfaces/user.interface';
import { splitDtoField } from '@helpers/splitDto';
import { transformPhoneNumber } from '@utils/transformPhoneNumber';

export const userUpdateMapper = (dto: UserUpdateDto): IUser => {
  const {
    phone,
    email,
    password,
    first_name,
    last_name,
    city,
    avatar,
    about,
    keywords,
    links,
    qualifications,
    education,
    project_involvement,
    job_format,
    job_experience,
    programs,
    specialization,
    is_hide_phone,
    is_eula_approved,
  } = dto;

  const splitPrograms = splitDtoField(programs);
  const splitKeywords = splitDtoField(keywords);
  const validPhone = transformPhoneNumber(phone);

  const additional_info: IAdditional = {
    ...(qualifications?.length && { qualifications }),
    ...(education?.length && { education }),
    ...(project_involvement && { project_involvement }),
    ...(job_format && { job_format }),
    ...(job_experience && { job_experience }),
    ...(about && { about }),
    ...(splitKeywords.length && { keywords: splitKeywords }),
  };

  const preferences: IPreference = {
    ...(is_hide_phone && { is_hide_phone }),
    ...(is_eula_approved && { is_eula_approved }),
  };

  return {
    ...(email && { email }),
    ...(password && { password }),
    ...(first_name && { first_name }),
    ...(last_name && { last_name }),
    ...(validPhone && validPhone !== 'undefined' && { phone: validPhone }),
    ...(avatar && { avatar }),
    ...(city && { city }),
    ...(links?.length && { links }),
    ...(additional_info && { additional_info }),
    ...(preferences && { preferences }),
    ...(specialization && { specialization }),
    ...(splitPrograms.length && { programs: splitPrograms }),
  };
};
