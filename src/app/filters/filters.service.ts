import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Cities } from '@app/filters/entities/cities.entity';
import { UpdateFiltersDto } from '@app/filters/dto/update-filters.dto';
import { IFilters, IFiltersResponse } from '@app/filters/interfaces/filters.interface';
import { Specializations } from '@app/filters/entities/specializations.entity';
import { Programs } from '@app/filters/entities/programs.entity';
import { filtersMapper } from '@app/filters/filters.mapper';
import { FilterKeys, FilterNames, GroupFilterKeys } from '@app/filters/consts';
import { IAllQueryFilters } from '@app/filters/interfaces/all-filters.interface';
import { EUserQualification } from '@shared/consts/user-qualification.enum';
import { EUserJobFormat } from '@shared/consts/user-format.enum';
import { EUserJobExperience } from '@shared/consts/user-experience.enum';
import { EUserProjectInvolvement } from '@shared/consts/user-involvement.enum';

const logger = new Logger('Filters');

@Injectable()
export class FiltersService {
  constructor(
    @InjectModel(Cities.name) private readonly citiesModel: Model<Cities>,
    @InjectModel(Specializations.name) private readonly specializationsModel: Model<Specializations>,
    @InjectModel(Programs.name) private readonly programsModel: Model<Programs>,
  ) {}

  async update(updateFiltersDto: UpdateFiltersDto): Promise<[] | PromiseSettledResult<unknown>[]> {
    try {
      return await Promise.allSettled([
        await this.updateFilters(updateFiltersDto[FilterKeys.City], this.citiesModel),
        await this.updateFilters(updateFiltersDto[FilterKeys.Spec], this.specializationsModel),
        await this.updateMultiFilters(updateFiltersDto[FilterKeys.Programs], this.programsModel),
      ]);
    } catch (err) {
      logger.error(`Error while update: ${(err as Error).message}`);
      throw err;
    }
  }

  async updateFilters(name: string, model: Model<IFilters>): Promise<IFilters> {
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

  async updateMultiFilters(names: string[], model: Model<IFilters>): Promise<IFilters[]> {
    try {
      const existingFilters = await model.find({ name: { $in: names } }).exec();
      const existingFilterNames = existingFilters.map((f) => f.name);
      const newFilterNames = names.filter((n) => !existingFilterNames.includes(n));

      if (newFilterNames.length > 0) {
        const newFilters: IFilters[] = newFilterNames.map((name) => ({ name }));
        await model.create(newFilters);
      }

      return [];
    } catch (err) {
      logger.error(`Error while updateMultiFilters: ${(err as Error).message}`);
      throw err;
    }
  }

  async findEntityByPayload<T>(model: Model<T>, payload: FilterQuery<T>) {
    try {
      return await model.findOne({ ...payload }).exec();
    } catch (err) {
      logger.error(`Error while findEntityByPayload: ${(err as Error).message}`);
      throw err;
    }
  }

  getFiltersPromises(query: Partial<IAllQueryFilters>) {
    return {
      cityPromise: query[FilterKeys.City] && this.findCityByPayload({ _id: query[FilterKeys.City] }),
      specPromises: query[FilterKeys.Spec] && query[FilterKeys.Spec]?.map((id) => this.findSpecByPayload({ _id: id })),
      programsPromises:
        query[FilterKeys.Programs] && query[FilterKeys.Programs]?.map((id) => this.findProgramsByPayload({ _id: id })),
    };
  }

  async findCityByPayload(payload: FilterQuery<Cities>) {
    try {
      return this.findEntityByPayload(this.citiesModel, payload);
    } catch (err) {
      logger.error(`Error while findCityByPayload: ${(err as Error).message}`);
      throw err;
    }
  }

  async findSpecByPayload(payload: FilterQuery<Specializations>) {
    try {
      return this.findEntityByPayload(this.specializationsModel, payload);
    } catch (err) {
      logger.error(`Error while findSpecByPayload: ${(err as Error).message}`);
      throw err;
    }
  }

  async findProgramsByPayload(payload: FilterQuery<Programs>) {
    try {
      return this.findEntityByPayload(this.programsModel, payload);
    } catch (err) {
      logger.error(`Error while findProgramsByPayload: ${(err as Error).message}`);
      throw err;
    }
  }

  async getCitiesFilter(): Promise<IFiltersResponse> {
    try {
      return filtersMapper(await this.citiesModel.find().exec(), FilterKeys.City, FilterNames.City, false);
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

  getGroupFilter(): IFiltersResponse {
    try {
      const groupFilter = Object.keys(GroupFilterKeys).map((key) => ({
        _id: key,
        name: GroupFilterKeys[key as keyof typeof GroupFilterKeys],
      }));
      return filtersMapper(groupFilter, FilterKeys.Group, FilterNames.Group, false);
    } catch (err) {
      logger.error(`Error while getGroupFilter: ${(err as Error).message}`);
      throw err;
    }
  }

  getQualificationsFilter(): IFiltersResponse {
    try {
      const qualificationFilter = Object.keys(EUserQualification).map((key) => ({
        _id: key,
        name: EUserQualification[key as keyof typeof EUserQualification],
      }));
      return filtersMapper(qualificationFilter, FilterKeys.Qualifications, FilterNames.Qualifications, true);
    } catch (err) {
      logger.error(`Error while getQualificationsFilter: ${(err as Error).message}`);
      throw err;
    }
  }

  getFormatFilter(): IFiltersResponse {
    try {
      const formatFilter = Object.keys(EUserJobFormat).map((key) => ({
        _id: key,
        name: EUserJobFormat[key as keyof typeof EUserJobFormat],
      }));
      return filtersMapper(formatFilter, FilterKeys.Format, FilterNames.Format, true);
    } catch (err) {
      logger.error(`Error while getFormatFilter: ${(err as Error).message}`);
      throw err;
    }
  }

  getExperienceFilter(): IFiltersResponse {
    try {
      const experienceFilter = Object.keys(EUserJobExperience).map((key) => ({
        _id: key,
        name: EUserJobExperience[key as keyof typeof EUserJobExperience],
      }));
      return filtersMapper(experienceFilter, FilterKeys.Experience, FilterNames.Experience, true);
    } catch (err) {
      logger.error(`Error while getExperienceFilter: ${(err as Error).message}`);
      throw err;
    }
  }

  getInvolvementFilter(): IFiltersResponse {
    try {
      const involvementFilter = Object.keys(EUserProjectInvolvement).map((key) => ({
        _id: key,
        name: EUserProjectInvolvement[key as keyof typeof EUserProjectInvolvement],
      }));
      return filtersMapper(involvementFilter, FilterKeys.Involvement, FilterNames.Involvement, true);
    } catch (err) {
      logger.error(`Error while getInvolvementFilter: ${(err as Error).message}`);
      throw err;
    }
  }
}
