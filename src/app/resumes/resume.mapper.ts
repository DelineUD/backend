import {
  IResume,
  IResumeAuthorResponse,
  IResumeResponse,
  UserResumePick,
} from '@app/resumes/interfaces/resume.interface';
import { ResumeDto } from '@app/resumes/dto/resume.dto';
import { IUser } from '@app/users/interfaces/user.interface';

const toResumeAuthor = (author: UserResumePick, youBlocked: boolean): IResumeAuthorResponse => {
  return {
    _id: author?._id ?? null,
    first_name: author?.first_name ?? null,
    last_name: author?.last_name ?? null,
    avatar: !youBlocked ? author?.avatar ?? null : null,
    qualification: author?.qualification ?? null,
    contact_link: !youBlocked ? author?.telegram ?? null : null,
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
export const resumeMapper = (resume: IResume, user: Pick<IUser, '_id' | 'blocked_users'>): IResumeResponse => {
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
    remote_work,
    author,
    about,
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
    remote_work,
    about,
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
export const resumeListMapper = (resumes: IResume[], user: Pick<IUser, '_id' | 'blocked_users'>): IResumeResponse[] => {
  return resumes.map((r) => resumeMapper(r, user)).filter((r) => r);
};
