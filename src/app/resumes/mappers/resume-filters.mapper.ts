import { FilterQuery } from 'mongoose';

import { FiltersService } from '@app/filters/filters.service';
import { filterQueriesMapper } from '@app/filters/mappers/filters.mapper';
import { ResumeFindQueryDto } from '@app/resumes/dto/resume-find-query.dto';

export async function resumeFiltersMapper(
  filtersService: FiltersService,
  // TODO - UDO-190
  { name, ...baseQueries }: FilterQuery<Partial<ResumeFindQueryDto>>,
): Promise<Partial<FilterQuery<Partial<ResumeFindQueryDto>>>> {
  const queryFilter: Partial<FilterQuery<Partial<ResumeFindQueryDto>>> = {};

  name && (queryFilter.name = { $regex: new RegExp(name, 'i') });

  const {
    cityPromises,
    specPromises,
    programsPromises,
    qualificationsPromises,
    jobFormatPromises,
    jobExperiencePromises,
    projectInvolvementPromises,
  } = filtersService.getFiltersPromises(baseQueries);

  const [city, spec, programs, qualifications, jobFormats, jobExperience, projectsInvolvement] =
    await Promise.allSettled([
      Promise.all(cityPromises),
      Promise.all(specPromises),
      Promise.all(programsPromises),
      Promise.all(qualificationsPromises),
      Promise.all(jobFormatPromises),
      Promise.all(jobExperiencePromises),
      Promise.all(projectInvolvementPromises),
    ]);

  filterQueriesMapper(city) && (queryFilter.city = filterQueriesMapper(city));
  filterQueriesMapper(spec) && (queryFilter.specialization = filterQueriesMapper(spec));
  filterQueriesMapper(programs) && (queryFilter.programs = filterQueriesMapper(programs));

  filterQueriesMapper(qualifications) && (queryFilter.qualifications = filterQueriesMapper(qualifications));
  filterQueriesMapper(jobFormats) && (queryFilter.job_format = filterQueriesMapper(jobFormats));
  filterQueriesMapper(jobExperience) && (queryFilter.job_experience = filterQueriesMapper(jobExperience));
  filterQueriesMapper(projectsInvolvement) &&
    (queryFilter.project_involvement = filterQueriesMapper(projectsInvolvement));

  return queryFilter;
}
