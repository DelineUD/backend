import {
  IResume,
  IResumeAuthorResponse,
  IResumeResponse,
  UserResumePick,
} from '@app/resumes/interfaces/resume.interface';
import { ResumeDto } from '@app/resumes/dto/resume.dto';
import { splitDtoField } from '@helpers/splitDto';

const toResumeAuthor = (author: UserResumePick): IResumeAuthorResponse => {
  return author
    ? {
        _id: author?._id ?? null,
        first_name: author?.first_name ?? null,
        last_name: author?.last_name ?? null,
        avatar: author?.avatar ?? null,
        qualification: author?.qualification ?? null,
        contact_link: author?.telegram ?? null,
      }
    : null;
};

export const resumeDtoMapper = (dto: ResumeDto): IResume => {
  const { spec, narrow_spec, ...rest } = dto;
  return {
    ...rest,
    specializations: spec,
    narrow_specializations: narrow_spec,
  };
};

export const resumeMapper = (payload: IResume): IResumeResponse => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { authorId, service_cost, portfolio, updatedAt, createdAt, ...resume } = JSON.parse(
    JSON.stringify(payload),
  ) as IResume;

  return {
    ...resume,
    service_cost: service_cost ?? null,
    portfolio: portfolio ?? null,
    author: toResumeAuthor(resume.author as UserResumePick),
    createdAt: String(createdAt),
    updatedAt: String(updatedAt),
  };
};

export const resumeListMapper = (payload: IResume[]): IResumeResponse[] => {
  const resumes = JSON.parse(JSON.stringify(payload)) as IResume[];

  return (
    resumes
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ authorId, service_cost, portfolio, updatedAt, createdAt, ...resume }) => {
        return {
          ...resume,
          service_cost: service_cost ?? null,
          portfolio: portfolio ?? null,
          author: toResumeAuthor(resume.author as UserResumePick),
          createdAt: String(createdAt),
          updatedAt: String(updatedAt),
        };
      })
      .filter((r) => r.author)
  );
};
