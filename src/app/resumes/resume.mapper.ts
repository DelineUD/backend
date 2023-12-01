import { IResume } from '@app/resumes/interfaces/resume.interface';
import { ResumeDto } from '@app/resumes/dto/resume.dto';
import { splitDtoField } from '@helpers/splitDto';

export const resumeMapper = (dto: ResumeDto): IResume => {
  const { qualification, narrow_spec, ...rest } = dto;
  return {
    ...rest,
    qualification: splitDtoField(qualification),
    narrow_spec: splitDtoField(narrow_spec),
  };
};
