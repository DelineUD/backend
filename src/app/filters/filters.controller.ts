import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FiltersService } from '@app/filters/filters.service';
import { UpdateFiltersDto } from '@app/filters/dto/update-filters.dto';
import { IFilters } from '@app/filters/interfaces/filters.interface';

@ApiTags('Filters')
@Controller('filters')
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  /**
   * Обновление фильтров.
   * @returns - обновление фильтров.
   */
  @Post('update')
  async update(updateFiltersDto: UpdateFiltersDto): Promise<[] | PromiseSettledResult<unknown>[]> {
    return await this.filtersService.update(updateFiltersDto);
  }

  /**
   * Получение фильтров для резюме.
   * @returns - Фильтры резюме.
   */
  @Get('resumes')
  public async getResumesFilter(): Promise<IFilters[]> {
    return await Promise.all([
      await this.filtersService.getCitiesFilter(),
      await this.filtersService.getSpecializationsFilter(),
      await this.filtersService.getNarrowSpecializationsFilter(),
      await this.filtersService.getProgramsFilter(),
    ]);
  }

  /**
   * Получение фильтров для вакансий.
   * @returns - Фильтры вакансий.
   */
  @Get('vacancies')
  public async getVacanciesFilter(): Promise<IFilters[]> {
    return await Promise.all([
      await this.filtersService.getCitiesFilter(),
      this.filtersService.getStatusFilter(),
      await this.filtersService.getSpecializationsFilter(),
      await this.filtersService.getNarrowSpecializationsFilter(),
      await this.filtersService.getProgramsFilter(),
    ]);
  }

  /**
   * Получение фильтров для резидентов.
   * @returns - Фильтры резидентов.
   */
  @Get('residents')
  public async getResidentsFilter(): Promise<IFilters[]> {
    return await Promise.all([
      this.filtersService.getStatusFilter(),
      await this.filtersService.getCitiesFilter(),
      await this.filtersService.getSpecializationsFilter(),
      await this.filtersService.getNarrowSpecializationsFilter(),
      await this.filtersService.getProgramsFilter(),
      await this.filtersService.getCoursesFilter(),
    ]);
  }

  /**
   * Получение фильтров для постов.
   * @returns - Фильтры постов.
   */
  @Get('posts')
  public async getPostsFilter(): Promise<IFilters[]> {
    return await Promise.all([this.filtersService.getGroupFilter()]);
  }

  /**
   * Получение фильтров для стран.
   * @returns - Фильтры страны.
   */
  @Get('countries')
  async getCountriesFilter(): Promise<IFilters> {
    return await this.filtersService.getCountriesFilter();
  }

  /**
   * Получение фильтров для городов.
   * @returns - Фильтры городов.
   */
  @Get('cities')
  async getCitiesFilter(): Promise<IFilters> {
    return await this.filtersService.getCitiesFilter();
  }

  /**
   * Получение фильтров для специализаций.
   * @returns - Фильтры специализаций.
   */
  @Get('specializations')
  async getSpecializationsFilter(): Promise<IFilters> {
    return await this.filtersService.getSpecializationsFilter();
  }

  /**
   * Получение фильтров для узких специализаций.
   * @returns - Фильтры узких специализаций.
   */
  @Get('narrow-specializations')
  async getNarrowSpecializationsFilter(): Promise<IFilters> {
    return await this.filtersService.getNarrowSpecializationsFilter();
  }

  /**
   * Получение фильтров для программ.
   * @returns - Фильтры программ.
   */
  @Get('programs')
  async getProgramsFilter(): Promise<IFilters> {
    return await this.filtersService.getProgramsFilter();
  }

  /**
   * Получение фильтров для курсов.
   * @returns - Фильтры курсов.
   */
  @Get('courses')
  async getCoursesFilter(): Promise<IFilters> {
    return await this.filtersService.getCoursesFilter();
  }

  /**
   * Получение фильтров для статуса.
   * @returns - Фильтры статуса.
   */
  @Get('status')
  public getStatusFilter(): IFilters {
    return this.filtersService.getStatusFilter();
  }
}
