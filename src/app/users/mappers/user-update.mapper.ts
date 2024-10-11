import { IAdditional, IPreference, IUser } from '@app/users/interfaces/user.interface';
import { UserEntity } from '@app/users/entities/user.entity';
import { UserUpdateDto } from '@app/users/dto/user-update.dto';
import { transformPhoneNumber } from '@utils/transformPhoneNumber';
import { splitDtoField } from '@helpers/splitDto';

export const userUpdateMapper = (dto: UserUpdateDto, currentUser: UserEntity): Partial<IUser> => {
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

  const additionalInfo: Partial<IAdditional> = {
    ...(qualifications !== undefined
      ? { qualifications }
      : { qualifications: currentUser.additional_info.qualifications }),
    ...(education !== undefined ? { education } : { education: currentUser.additional_info.education }),
    ...(project_involvement !== undefined
      ? { project_involvement }
      : { project_involvement: currentUser.additional_info.project_involvement }),
    ...(job_format !== undefined ? { job_format } : { job_format: currentUser.additional_info.job_format }),
    ...(job_experience !== undefined
      ? { job_experience }
      : { job_experience: currentUser.additional_info.job_experience }),
    ...(about !== undefined ? { about } : { about: currentUser.additional_info.about }),
    ...(keywords !== undefined
      ? { keywords: splitDtoField(keywords) }
      : { keywords: currentUser.additional_info.keywords }),
  };

  const preferences: Partial<IPreference> = {
    ...(is_hide_phone !== undefined ? { is_hide_phone } : { is_hide_phone: currentUser.preferences.is_hide_phone }),
    ...(is_eula_approved !== undefined
      ? { is_eula_approved }
      : { is_eula_approved: currentUser.preferences.is_eula_approved }),
  };

  return {
    ...(email !== undefined && { email }),
    ...(password !== undefined && { password }),
    ...(first_name !== undefined && { first_name }),
    ...(last_name !== undefined && { last_name }),
    ...(phone !== undefined && { phone: transformPhoneNumber(phone) }),
    ...(avatar !== undefined
      ? {
          avatar: `${process.env.SERVER_URL}/${process.env.STATIC_PATH}/${process.env.IMAGES_FOLDER}/${avatar.filename}`,
        }
      : { avatar: '' }),
    ...(city !== undefined && { city }),
    ...(links !== undefined && { links }),
    ...(Object.keys(additionalInfo).length > 0 && { additional_info: additionalInfo }),
    ...(Object.keys(preferences).length > 0 && { preferences }),
    ...(specialization !== undefined && { specialization }),
    ...(programs !== undefined && { programs: splitDtoField(programs) }),
  };
};
