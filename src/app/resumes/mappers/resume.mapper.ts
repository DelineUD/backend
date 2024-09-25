import { UserEntity } from '@app/users/entities/user.entity';
import {
  IResume,
  IResumeResponse,
  IResumeAuthor,
  UserResumePick,
  IResumeListResponse,
} from '../interfaces/resume.interface';

const toResumeAuthor = (author: UserResumePick, youBlocked: boolean): IResumeAuthor => {
  return author
    ? {
        _id: author._id,
        first_name: author.first_name,
        last_name: author.last_name,
        avatar: !youBlocked ? author?.avatar ?? null : null,
      }
    : null;
};

export const resumeMapper = (resume: IResume, user: Pick<UserEntity, '_id' | 'bun_info'>): IResumeResponse => {
  const {
    _id,
    name,
    job_format,
    job_experience,
    specialization,
    contacts,
    city,
    about,
    project_involvement,
    qualifications,
    programs,
    author,
    createdAt,
    updatedAt,
  } = resume;

  const youBlocked = author?.bun_info?.blocked_users?.includes(user._id) ?? false;

  return {
    _id,
    name,
    job_format,
    job_experience,
    contacts,
    specialization,
    city: city ?? null,
    about: about ?? null,
    project_involvement: project_involvement ?? null,
    qualifications: qualifications ?? null,
    programs: programs ?? null,
    author: toResumeAuthor(author as UserResumePick, youBlocked),
    created_at: createdAt,
    updated_at: updatedAt,
  };
};

export const resumeListMapper = (
  vacancies: IResume[],
  user: Pick<UserEntity, '_id' | 'bun_info'>,
): IResumeListResponse => {
  return vacancies
    .map((vacancy) => {
      const { _id, name, job_format, job_experience, city, project_involvement, author, createdAt, updatedAt } =
        vacancy;

      const youBlocked = author?.bun_info?.blocked_users?.includes(user._id) ?? false;

      return {
        _id,
        name,
        job_format,
        job_experience,
        city: city ?? null,
        project_involvement: project_involvement ?? null,
        author: toResumeAuthor(author as UserResumePick, youBlocked),
        created_at: createdAt,
        updated_at: updatedAt,
      };
    })
    .filter((v) => v);
};
