import { IResume } from '@app/resumes/interfaces/resume.interface';
import { ResumeUpdateDto } from '@app/resumes/dto/resume-update.dto';

export const resumeUpdateMapper = (dto: ResumeUpdateDto): Partial<IResume> => {
  const {
    name,
    job_experience,
    job_format,
    specialization,
    contacts,
    about,
    city,
    project_involvement,
    qualifications,
    programs,
  } = dto;

  return {
    ...(name !== undefined && { name }),
    ...(job_experience !== undefined && { job_experience }),
    ...(job_format !== undefined && { job_format }),
    ...(specialization !== undefined && { specialization }),
    ...(contacts !== undefined && { contacts }),
    ...(about !== undefined && { about }),
    ...(city !== undefined && { city }),
    ...(project_involvement !== undefined && { project_involvement }),
    ...(qualifications !== undefined && { qualifications }),
    ...(programs !== undefined && { programs }),
  };
};
