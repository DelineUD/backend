import { UserEntity } from '@app/users/entities/user.entity';
import { IProfileListResponse } from '@app/profiles/interfaces/profile-list.interface';
import { IProfileResponse } from '@app/profiles/interfaces/profile.interface';

export const profileListMapper = (
  profiles: UserEntity[],
  user: Pick<UserEntity, '_id' | 'bun_info'>,
): IProfileListResponse => {
  return profiles.map(({ _id, first_name, last_name, avatar, city, bun_info }) => {
    const isBlocked = user._id !== _id ? user.bun_info?.blocked_users?.includes(_id) ?? false : undefined;
    const youBlocked = user._id !== _id ? bun_info?.blocked_users?.includes(user._id) ?? false : undefined;
    return {
      _id,
      first_name,
      last_name,
      avatar,
      city,
      ...(isBlocked !== undefined && { isBlocked }),
      ...(youBlocked !== undefined && { youBlocked }),
    };
  });
};

export const profileMapper = (profile: UserEntity, user: Pick<UserEntity, '_id' | 'bun_info'>): IProfileResponse => {
  const {
    _id,
    first_name,
    last_name,
    phone,
    email,
    avatar,
    city,
    additional_info,
    bun_info,
    programs,
    specialization,
    links,
  } = profile;

  const isBlocked = user._id !== _id ? user.bun_info?.blocked_users?.includes(_id) ?? false : undefined;
  const youBlocked = user._id !== _id ? bun_info?.blocked_users?.includes(user._id) ?? false : undefined;

  return {
    _id,
    first_name,
    last_name,
    phone,
    email,
    avatar: !youBlocked && avatar ? avatar : null,
    personal_information: {
      about: additional_info?.about ?? null,
      city: city ?? null,
      keywords: additional_info?.keywords ?? [],
      links: links ?? null,
      education: {
        additional_education: additional_info.education ?? null,
        qualifications: additional_info?.qualifications ?? null,
        programs: programs ?? null,
      },
      specialization: specialization ?? null,
      job_format: additional_info?.job_format ?? null,
      job_experience: additional_info?.job_experience ?? null,
      project_involvement: additional_info?.project_involvement ?? null,
    },
    ...(isBlocked !== undefined && { isBlocked }),
    ...(youBlocked !== undefined && { youBlocked }),
  };
};
