import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { CitiesEntity } from '@app/filters/entities/cities.entity';
import { UpdateFiltersDto } from '@app/filters/dto/update-filters.dto';
import { IFilter, IFiltersResponse } from '@app/filters/interfaces/filters.interface';
import { SpecializationsEntity } from '@app/filters/entities/specializations.entity';
import { ProgramsEntity } from '@app/filters/entities/programs.entity';
import { filtersMapper } from '@app/filters/mappers/filters.mapper';
import {
  FilterKeys,
  FilterNames,
  groupFilters,
  jobExperienceFilters,
  jobFormatFilters,
  projectInvolvementFilters,
  qualificationsFilters,
} from '@app/filters/consts';
import { GroupsEntity } from '@app/filters/entities/groups.entity';
import { JobFormatsEntity } from '@app/filters/entities/job-formats.entity';
import { JobExperienceEntity } from '@app/filters/entities/job-experience.entity';
import { ProjectsInvolvementEntity } from '@app/filters/entities/projects-involvement.entity';
import { Qualifications } from '@app/filters/entities/qualifications.entity';
import { IFiltersQuery } from '@app/filters/interfaces/filtets-query.interface';

const logger = new Logger('Filters');

@Injectable()
export class FiltersService {
  constructor(
    @InjectModel(CitiesEntity.name) private readonly citiesModel: Model<CitiesEntity>,
    @InjectModel(SpecializationsEntity.name) private readonly specializationsModel: Model<SpecializationsEntity>,
    @InjectModel(ProgramsEntity.name) private readonly programsModel: Model<ProgramsEntity>,
    @InjectModel(Qualifications.name) private readonly qualificationsModel: Model<Qualifications>,
    @InjectModel(GroupsEntity.name) private readonly groupsEntity: Model<GroupsEntity>,
    @InjectModel(JobFormatsEntity.name) private readonly jobFormatsEntity: Model<JobFormatsEntity>,
    @InjectModel(JobExperienceEntity.name) private readonly jobExperienceEntity: Model<JobExperienceEntity>,
    @InjectModel(ProjectsInvolvementEntity.name)
    private readonly projectsInvolvementEntity: Model<ProjectsInvolvementEntity>,
  ) {}

  async update(updateFiltersDto: UpdateFiltersDto): Promise<[] | PromiseSettledResult<unknown>[]> {
    try {
      return await Promise.allSettled([
        await this.updateFilters(updateFiltersDto[FilterKeys.City], this.citiesModel),
        await this.updateMultiFilters(updateFiltersDto[FilterKeys.Spec], this.specializationsModel),
        await this.updateMultiFilters(updateFiltersDto[FilterKeys.Programs], this.programsModel),
      ]);
    } catch (err) {
      logger.error(`Error while update: ${(err as Error).message}`);
      throw err;
    }
  }

  async updateFilters(name: string, model: Model<IFilter>): Promise<IFilter> {
    try {
      if (!name) {
        return;
      }

      const filter = await model.findOne({ name }).exec();
      if (!filter) {
        await model.create({ name });
      }

      return filter;
    } catch (err) {
      logger.error(`Error while updateFilters: ${(err as Error).message}`);
      throw err;
    }
  }

  async updateMultiFilters(names: string[], model: Model<IFilter>): Promise<IFilter[]> {
    try {
      const existingFilters = await model.find({ name: { $in: names } }).exec();
      const existingFilterNames = existingFilters.map((f) => f.name);
      const newFilterNames = names.filter((n) => !existingFilterNames.includes(n));

      if (newFilterNames.length > 0) {
        const newFilters: IFilter[] = newFilterNames.map((name) => ({ name }));
        await model.create(newFilters);
      }

      return [];
    } catch (err) {
      logger.error(`Error while updateMultiFilters: ${(err as Error).message}`);
      throw err;
    }
  }

  /* Finding */
  async findEntityByPayload<T>(model: Model<T>, payload: FilterQuery<T>) {
    try {
      return await model.findOne({ ...payload }).exec();
    } catch (err) {
      logger.error(`Error while findEntityByPayload: ${(err as Error).message}`);
      throw err;
    }
  }

  async findCityByPayload(payload: FilterQuery<CitiesEntity>) {
    try {
      return this.findEntityByPayload(this.citiesModel, payload);
    } catch (err) {
      logger.error(`Error while findCityByPayload: ${(err as Error).message}`);
      throw err;
    }
  }

  async findSpecByPayload(payload: FilterQuery<SpecializationsEntity>) {
    try {
      return this.findEntityByPayload(this.specializationsModel, payload);
    } catch (err) {
      logger.error(`Error while findSpecByPayload: ${(err as Error).message}`);
      throw err;
    }
  }

  async findProgramsByPayload(payload: FilterQuery<ProgramsEntity>) {
    try {
      return this.findEntityByPayload(this.programsModel, payload);
    } catch (err) {
      logger.error(`Error while findProgramsByPayload: ${(err as Error).message}`);
      throw err;
    }
  }

  /* Getters */
  getFiltersPromises(query: Partial<IFiltersQuery>) {
    return {
      cityPromises: query[FilterKeys.City]?.map((id) => this.findCityByPayload({ _id: id })),
      specPromises: query[FilterKeys.Spec]?.map((id) => this.findSpecByPayload({ _id: id })),
      programsPromises: query[FilterKeys.Programs]?.map((id) => this.findProgramsByPayload({ _id: id })),
      qualificationsPromises: query[FilterKeys.Qualifications]?.map((id) =>
        this.findEntityByPayload(this.qualificationsModel, { _id: id }),
      ),
      jobFormatPromises: query[FilterKeys.Format]?.map((id) =>
        this.findEntityByPayload(this.jobFormatsEntity, { _id: id }),
      ),
      jobExperiencePromises: query[FilterKeys.Experience]?.map((id) =>
        this.findEntityByPayload(this.jobExperienceEntity, { _id: id }),
      ),
      projectInvolvementPromises: query[FilterKeys.Involvement]?.map((id) =>
        this.findEntityByPayload(this.projectsInvolvementEntity, { _id: id }),
      ),
    };
  }

  async getCitiesFilter(): Promise<IFiltersResponse> {
    try {
      return filtersMapper(await this.citiesModel.find().exec(), FilterKeys.City, FilterNames.City, true);
    } catch (err) {
      logger.error(`Error while getCitiesFilter: ${(err as Error).message}`);
      throw err;
    }
  }

  async getSpecializationsFilter(): Promise<IFiltersResponse> {
    try {
      return filtersMapper(await this.specializationsModel.find().exec(), FilterKeys.Spec, FilterNames.Spec, true);
    } catch (err) {
      logger.error(`Error while getSpecializationsFilter: ${(err as Error).message}`);
      throw err;
    }
  }

  async getProgramsFilter(): Promise<IFiltersResponse> {
    try {
      return filtersMapper(await this.programsModel.find().exec(), FilterKeys.Programs, FilterNames.Programs, true);
    } catch (err) {
      logger.error(`Error while getProgramsFilter: ${(err as Error).message}`);
      throw err;
    }
  }

  async getGroupFilter(): Promise<IFiltersResponse> {
    try {
      return filtersMapper(await this.groupsEntity.find().exec(), FilterKeys.Group, FilterNames.Group, false);
    } catch (err) {
      logger.error(`Error while getGroupFilter: ${(err as Error).message}`);
      throw err;
    }
  }

  async getQualificationsFilter(): Promise<IFiltersResponse> {
    try {
      return filtersMapper(
        await this.qualificationsModel.find().exec(),
        FilterKeys.Qualifications,
        FilterNames.Qualifications,
        true,
      );
    } catch (err) {
      logger.error(`Error while getQualificationsFilter: ${(err as Error).message}`);
      throw err;
    }
  }

  async getFormatFilter(): Promise<IFiltersResponse> {
    try {
      return filtersMapper(await this.jobFormatsEntity.find().exec(), FilterKeys.Format, FilterNames.Format, true);
    } catch (err) {
      logger.error(`Error while getFormatFilter: ${(err as Error).message}`);
      throw err;
    }
  }

  async getExperienceFilter(): Promise<IFiltersResponse> {
    try {
      return filtersMapper(
        await this.jobExperienceEntity.find().exec(),
        FilterKeys.Experience,
        FilterNames.Experience,
        true,
      );
    } catch (err) {
      logger.error(`Error while getExperienceFilter: ${(err as Error).message}`);
      throw err;
    }
  }

  async getInvolvementFilter(): Promise<IFiltersResponse> {
    try {
      return filtersMapper(
        await this.projectsInvolvementEntity.find().exec(),
        FilterKeys.Involvement,
        FilterNames.Involvement,
        true,
      );
    } catch (err) {
      logger.error(`Error while getInvolvementFilter: ${(err as Error).message}`);
      throw err;
    }
  }

  async seedGroupFilters(): Promise<void> {
    await this.createOrUpdateFilters(groupFilters, this.groupsEntity);
  }

  async seedJobExperienceFilters(): Promise<void> {
    await this.createOrUpdateFilters(jobExperienceFilters, this.jobExperienceEntity);
  }

  async seedJobFormatFilters(): Promise<void> {
    await this.createOrUpdateFilters(jobFormatFilters, this.jobFormatsEntity);
  }

  async seedProjectInvolvementFilters(): Promise<void> {
    await this.createOrUpdateFilters(projectInvolvementFilters, this.projectsInvolvementEntity);
  }

  async seedQualificationFilters(): Promise<void> {
    await this.createOrUpdateFilters(qualificationsFilters, this.qualificationsModel);
  }

  async seedAllFilters(): Promise<void> {
    try {
      await Promise.all([
        this.seedGroupFilters(),
        this.seedJobExperienceFilters(),
        this.seedJobFormatFilters(),
        this.seedProjectInvolvementFilters(),
        this.seedQualificationFilters(),
      ]);
    } catch (err) {
      throw err;
    }
  }

  private async createOrUpdateFilters(filters: IFilter[], model: Model<IFilter>) {
    for (const filter of filters) {
      const existingFilter = await model.findOne({ name: filter.name }).exec();
      if (!existingFilter) {
        await model.create(filter);
      }
    }
  }
}
