import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Countries } from '@app/filters/entities/countries.entity';
import { Cities } from '@app/filters/entities/cities.entity';
import { UpdateFiltersDto } from '@app/filters/dto/update-filters.dto';
import { IFilters, IFiltersResponse } from '@app/filters/interfaces/filters.interface';
import { Specializations } from '@app/filters/entities/specializations.entity';
import { NarrowSpecializations } from '@app/filters/entities/narrow-specializations.entity';
import { Programs } from '@app/filters/entities/programs.entity';
import { Courses } from '@app/filters/entities/courses.entity';
import { filtersMapper } from '@app/filters/filters.mapper';

@Injectable()
export class FiltersService {
  constructor(
    @InjectModel(Countries.name) private readonly countriesModel: Model<Countries>,
    @InjectModel(Cities.name) private readonly citiesModel: Model<Cities>,
    @InjectModel(Specializations.name) private readonly specializationsModel: Model<Specializations>,
    @InjectModel(NarrowSpecializations.name) private readonly narrowSpecializationsModel: Model<NarrowSpecializations>,
    @InjectModel(Programs.name) private readonly programsModel: Model<Programs>,
    @InjectModel(Courses.name) private readonly coursesModel: Model<Courses>,
  ) {}

  async update(updateFiltersDto: UpdateFiltersDto): Promise<[] | PromiseSettledResult<unknown>[]> {
    try {
      return await Promise.allSettled([
        await this.updateFilters(updateFiltersDto.countryName, this.countriesModel),
        await this.updateFilters(updateFiltersDto.cityName, this.citiesModel),
        await this.updateMultiFilters(updateFiltersDto.specializationNames, this.specializationsModel),
        await this.updateMultiFilters(updateFiltersDto.narrowSpecializationNames, this.narrowSpecializationsModel),
        await this.updateMultiFilters(updateFiltersDto.programs, this.programsModel),
        await this.updateMultiFilters(updateFiltersDto.courses, this.coursesModel),
      ]);
    } catch (err) {
      throw err;
    }
  }

  async updateFilters(name: string, model: Model<IFilters>): Promise<void> {
    try {
      const filter = await model.findOne({ name }).exec();
      if (!filter) {
        await model.create({ name });
      }
      return;
    } catch (err) {
      throw err;
    }
  }

  async updateMultiFilters(names: string[], model: Model<IFilters>): Promise<void> {
    try {
      const existingFilters = await model.find({ name: { $in: names } }).exec();
      const existingFilterNames = existingFilters.map((f) => f.name);
      const newFilterNames = names.filter((n) => !existingFilterNames.includes(n));

      if (newFilterNames.length > 0) {
        const newFilters: IFilters[] = newFilterNames.map((name) => ({ name }));
        await model.create(newFilters);
      }

      return;
    } catch (err) {
      throw err;
    }
  }

  async findCountries(): Promise<IFiltersResponse> {
    try {
      return filtersMapper(await this.countriesModel.find().exec(), 'country', false);
    } catch (err) {
      throw err;
    }
  }

  async findCities(): Promise<IFilters> {
    try {
      return filtersMapper(await this.citiesModel.find().exec(), 'city', false);
    } catch (err) {
      throw err;
    }
  }

  async findSpecializations(): Promise<IFiltersResponse> {
    try {
      return filtersMapper(await this.specializationsModel.find().exec(), 'specializations', true);
    } catch (err) {
      throw err;
    }
  }

  async findNarrowSpecializations(): Promise<IFiltersResponse> {
    try {
      return filtersMapper(await this.narrowSpecializationsModel.find().exec(), 'narrow_specializations', true);
    } catch (err) {
      throw err;
    }
  }

  async findPrograms(): Promise<IFiltersResponse> {
    try {
      return filtersMapper(await this.programsModel.find().exec(), 'programs', true);
    } catch (err) {
      throw err;
    }
  }

  async findCourses(): Promise<IFiltersResponse> {
    try {
      return filtersMapper(await this.coursesModel.find().exec(), 'courses', true);
    } catch (err) {
      throw err;
    }
  }

  findPosts(): IFiltersResponse {
    try {
      const postsFilters: IFilters[] = [
        {
          code: 'pf001',
          name: 'Общее',
        },
        {
          code: 'pf002',
          name: 'Администрация',
        },
        {
          code: 'pf003',
          name: 'HH',
        },
      ];
      return filtersMapper(postsFilters, 'group', false);
    } catch (err) {
      throw err;
    }
  }
}
