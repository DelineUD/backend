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
        await this.updateCountries(updateFiltersDto.countryName),
        await this.updateCities(updateFiltersDto.cityName),
        await this.updateSpecializations(updateFiltersDto.specializationNames),
        await this.updateNarrowSpecializations(updateFiltersDto.narrowSpecializationNames),
        await this.updatePrograms(updateFiltersDto.programs),
        await this.updateCourses(updateFiltersDto.courses),
      ]);
    } catch (err) {
      throw err;
    }
  }

  async updateCountries(countryName: string): Promise<void> {
    try {
      const country = await this.countriesModel.findOne({ name: countryName }).exec();
      if (!country) {
        await this.countriesModel.create({ name: countryName });
      }
      return;
    } catch (err) {
      throw err;
    }
  }

  async updateCities(cityName: string): Promise<void> {
    try {
      const city = await this.citiesModel.findOne({ name: cityName }).exec();
      if (!city) {
        await this.citiesModel.create({ name: cityName });
      }
      return;
    } catch (err) {
      throw err;
    }
  }

  async updateSpecializations(names: string[]): Promise<void> {
    try {
      const existingSpecializations = await this.specializationsModel.find({ name: { $in: names } }).exec();
      const existingSpecNames = existingSpecializations.map((s) => s.name);
      const newSpecNames = names.filter((n) => !existingSpecNames.includes(n));

      if (newSpecNames.length > 0) {
        const newSpecializations: IFilters[] = newSpecNames.map((name) => ({ name }));
        await this.specializationsModel.create(newSpecializations);
      }

      return;
    } catch (err) {
      throw err;
    }
  }

  async updateNarrowSpecializations(names: string[]): Promise<void> {
    try {
      const existingNarrowSpec = await this.narrowSpecializationsModel.find({ name: { $in: names } }).exec();
      const existingNarrowSpecNames = existingNarrowSpec.map((s) => s.name);
      const newNarrowSpecNames = names.filter((n) => !existingNarrowSpecNames.includes(n));

      if (newNarrowSpecNames.length > 0) {
        const newSpecializations: IFilters[] = newNarrowSpecNames.map((name) => ({ name }));
        await this.narrowSpecializationsModel.create(newSpecializations);
      }

      return;
    } catch (err) {
      throw err;
    }
  }

  async updatePrograms(names: string[]): Promise<void> {
    try {
      const existingPrograms = await this.programsModel.find({ name: { $in: names } }).exec();
      const existingProgramsNames = existingPrograms.map((p) => p.name);
      const newProgramsNames = names.filter((n) => !existingProgramsNames.includes(n));

      if (newProgramsNames.length > 0) {
        const newSpecializations: IFilters[] = newProgramsNames.map((name) => ({ name }));
        await this.programsModel.create(newSpecializations);
      }

      return;
    } catch (err) {
      throw err;
    }
  }

  async updateCourses(names: string[]): Promise<void> {
    try {
      const existingCourses = await this.coursesModel.find({ name: { $in: names } }).exec();
      const existingCoursesNames = existingCourses.map((c) => c.name);
      const newProgramsNames = names.filter((n) => !existingCoursesNames.includes(n));

      if (newProgramsNames.length > 0) {
        const newCourses: IFilters[] = newProgramsNames.map((name) => ({ name }));
        await this.coursesModel.create(newCourses);
      }

      return;
    } catch (err) {
      throw err;
    }
  }

  async findCountries(): Promise<IFiltersResponse> {
    try {
      return filtersMapper(await this.countriesModel.find().exec(), 'Страна', false);
    } catch (err) {
      throw err;
    }
  }

  async findCities(): Promise<IFilters> {
    try {
      return filtersMapper(await this.citiesModel.find().exec(), 'Город', false);
    } catch (err) {
      throw err;
    }
  }

  async findSpecializations(): Promise<IFiltersResponse> {
    try {
      return filtersMapper(await this.specializationsModel.find().exec(), 'Специализация', true);
    } catch (err) {
      throw err;
    }
  }

  async findNarrowSpecializations(): Promise<IFiltersResponse> {
    try {
      return filtersMapper(await this.narrowSpecializationsModel.find().exec(), 'Узкая специализация', true);
    } catch (err) {
      throw err;
    }
  }

  async findPrograms(): Promise<IFiltersResponse> {
    try {
      return filtersMapper(await this.programsModel.find().exec(), 'Программы', true);
    } catch (err) {
      throw err;
    }
  }

  async findCourses(): Promise<IFiltersResponse> {
    try {
      return filtersMapper(await this.coursesModel.find().exec(), 'Курсы', true);
    } catch (err) {
      throw err;
    }
  }
}
