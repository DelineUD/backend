import { ResumeDto } from '@app/resumes/dto/resume.dto';
import {
  IResume,
  IResumeAuthorResponse,
  IResumeResponse,
  UserResumePick,
} from '@app/resumes/interfaces/resume.interface';
import { UserEntity } from '../users/entities/user.entity';

const toResumeAuthor = (author: UserResumePick, youBlocked: boolean): IResumeAuthorResponse => {
  return {
    _id: author?._id ?? null,
    first_name: author?.first_name ?? null,
    last_name: author?.last_name ?? null,
    avatar: !youBlocked ? author?.avatar ?? null : null,
    qualification: null,
    contact_link: null,
  };
};

/*
 * Function for transferring data from get course api
 */
export const resumeDtoMapper = (dto: ResumeDto): IResume => {
  const { spec, narrow_spec, ...rest } = dto;
  return {
    ...rest,
    specializations: spec,
    narrow_specializations: narrow_spec,
  };
};

/*
 * Function for formatting resume data before sending
 * user -> found user
 */
export const resumeMapper = (resume: IResume, user: Pick<UserEntity, '_id' | 'bun_info'>): IResumeResponse => {
  if (!resume.author) {
    return null;
  }

  const {
    _id,
    id,
    specializations,
    narrow_specializations,
    qualification,
    city,
    country,
    format,
    author,
    about,
    other,
    service_cost,
    portfolio,
    updatedAt,
    createdAt,
  } = resume;

  const youBlocked = author.blocked_users?.includes(user._id) ?? false;

  return {
    _id,
    id,
    specializations,
    narrow_specializations,
    qualification,
    city,
    country,
    format,
    about,
    other,
    service_cost: service_cost ?? null,
    portfolio: portfolio ?? null,
    author: toResumeAuthor(author as UserResumePick, youBlocked),
    createdAt: String(createdAt),
    updatedAt: String(updatedAt),
  };
};

/*
 * Function for formatting resume list data before sending
 * user -> found user
 */
export const resumeListMapper = (resumes: IResume[], user: Pick<UserEntity, '_id' | 'bun_info'>): IResumeResponse[] => {
  return resumes.map((r) => resumeMapper(r, user)).filter((r) => r);
};
