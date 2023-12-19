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
        avatar: author?.avatar ?? null,
        qualification: author?.qualification ?? null,
        contact_link: author?.telegram ?? null,
      }
    : null;
};

export const resumeDtoMapper = (dto: ResumeDto): IResume => {
  const { qualification, narrow_spec, ...rest } = dto;
  return {
    ...rest,
    qualification: splitDtoField(qualification),
    narrow_spec: splitDtoField(narrow_spec),
  };
};

export const resumeMapper = (payload: IResume): IResumeResponse => {
  const resume = JSON.parse(JSON.stringify(payload)) as IResume;

  return {
    ...resume,
    author: toResumeAuthor(resume.author as UserResumePick),
  };
};

export const resumeListMapper = (payload: IResume[]): IResumeResponse[] => {
  const resumes = JSON.parse(JSON.stringify(payload)) as IResume[];

  return resumes
    .map((resume) => {
      return {
        ...resume,
        author: toResumeAuthor(resume.author as UserResumePick),
      };
    })
    .filter((r) => r.author);
};
