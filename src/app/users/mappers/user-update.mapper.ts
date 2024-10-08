import { IAdditional, IPreference, IUser } from '@app/users/interfaces/user.interface';
import { UserUpdateDto } from '@app/users/dto/user-update.dto';
import { transformPhoneNumber } from '@utils/transformPhoneNumber';
import { splitDtoField } from '@helpers/splitDto';

export const userUpdateMapper = (dto: UserUpdateDto): Partial<IUser> => {
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

  const additional_info: Partial<IAdditional> = {
    ...(qualifications && { qualifications }),
    ...(education && { education }),
    ...(project_involvement && { project_involvement }),
    ...(job_format && { job_format }),
    ...(job_experience && { job_experience }),
    ...(about && { about }),
    ...(splitKeywords?.length ? { keywords: splitKeywords } : { keywords: [] }),
  };

  const preferences: Partial<IPreference> = {
    ...(is_hide_phone != null && { is_hide_phone }),
    ...(is_eula_approved != null && { is_eula_approved }),
  };

  return {
    ...(email && { email }),
    ...(password && { password }),
    ...(first_name && { first_name }),
    ...(last_name && { last_name }),
    ...(validPhone && { phone: validPhone }),
    ...(avatar && { avatar }),
    ...(city && { city }),
    ...(links?.length ? { links } : { links: [] }),
    ...(Object.keys(additional_info).length && { additional_info }),
    ...(Object.keys(preferences).length && { preferences }),
    ...(specialization && { specialization }),
    ...(splitPrograms?.length ? { programs: splitPrograms } : {}),
  };
};
