import { UserCreateDto } from '@/app/users/dto/user-create.dto';
import { IAdditional, IPreference, IUser } from '@/app/users/interfaces/user.interface';
import { splitDtoField } from '@helpers/splitDto';

export const createUserMapper = (dto: UserCreateDto): IUser => {
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
    project_involvement,
    job_format,
    job_experience,
    programs,
    specializations,
    is_hide_phone,
    getcourse_id,
  } = dto;

  const splitPrograms = splitDtoField(programs);
  const splitSpecializations = splitDtoField(specializations);
  const splitKeywords = splitDtoField(keywords);

  const additional_info: IAdditional = {
    ...(qualifications?.length && { qualifications }),
    project_involvement,
    job_format,
    job_experience,
    ...(about && { about }),
    ...(splitKeywords.length && { keywords: splitKeywords }),
  };

  const preferences: IPreference = {
    is_hide_phone,
    is_eula_approved: false,
  };

  return {
    phone,
    email,
    password,
    first_name,
    last_name,
    ...(avatar && { avatar }),
    ...(city && { city }),
    ...(links?.length && { links }),
    additional_info,
    preferences,
    ...(splitPrograms.length && { programs: splitPrograms }),
    ...(splitSpecializations.length && { specializations: splitSpecializations }),
    ...(getcourse_id && { getcourse_id }),
  };
};
