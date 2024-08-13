import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Cities } from '@app/filters/entities/cities.entity';
import { UpdateFiltersDto } from '@app/filters/dto/update-filters.dto';
import { IFilters, IFiltersResponse } from '@app/filters/interfaces/filters.interface';
import { Specializations } from '@app/filters/entities/specializations.entity';
import { Programs } from '@app/filters/entities/programs.entity';
import { filtersMapper } from '@app/filters/filters.mapper';
import { FilterKeys, FilterNames, GroupFilterKeys, StatusFilterKeys } from '@app/filters/consts';
import { IAllQueryFilters } from '@app/filters/interfaces/all-filters.interface';

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
        await this.updateMultiFilters(updateFiltersDto[FilterKeys.Spec], this.specializationsModel),
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

  async getCitiesFilter(): Promise<IFilters> {
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

  getStatusFilter(): IFiltersResponse {
    try {
      const statusFilter = Object.keys(StatusFilterKeys).map((key) => ({
        _id: key,
        name: StatusFilterKeys[key as keyof typeof StatusFilterKeys],
      }));
      return filtersMapper(statusFilter, FilterKeys.Status, FilterNames.Status, false);
    } catch (err) {
      logger.error(`Error while getStatusFilter: ${(err as Error).message}`);
      throw err;
    }
  }
}
