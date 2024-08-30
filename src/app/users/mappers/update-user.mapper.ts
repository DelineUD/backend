import { UserUpdateDto } from '@app/users/dto/user-update.dto';
import { IAdditional, IPreference, IUser } from '@app/users/interfaces/user.interface';
import { splitDtoField } from '@helpers/splitDto';
import { transformPhoneNumber } from '@utils/transformPhoneNumber';

export const updateUserMapper = (dto: UserUpdateDto): IUser => {
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
    specialization,
    is_hide_phone,
  } = dto;

  const splitPrograms = splitDtoField(programs);
  const splitKeywords = splitDtoField(keywords);
  const validPhone = transformPhoneNumber(phone);

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
    email,
    password,
    first_name,
    last_name,
    phone: validPhone,
    ...(avatar && { avatar }),
    ...(city && { city }),
    ...(links?.length && { links }),
    additional_info,
    preferences,
    specialization,
    ...(splitPrograms.length && { programs: splitPrograms }),
  };
};
