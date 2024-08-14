import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FiltersService } from '@app/filters/filters.service';
import { UpdateFiltersDto } from '@app/filters/dto/update-filters.dto';
import { IFilters, IFiltersResponse } from '@app/filters/interfaces/filters.interface';

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
      await this.filtersService.getSpecializationsFilter(),
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
      await this.filtersService.getCitiesFilter(),
      await this.filtersService.getSpecializationsFilter(),
      await this.filtersService.getProgramsFilter(),
      this.getQualificationsFilter(),
      this.getFormatFilter(),
      this.getExperienceFilter(),
      this.getInvolvementFilter(),
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
   * Получение фильтров для городов.
   * @returns - Фильтры городов.
   */
  @Get('cities')
  async getCitiesFilter(): Promise<IFiltersResponse> {
    return await this.filtersService.getCitiesFilter();
  }

  /**
   * Получение фильтров для специализаций.
   * @returns - Фильтры специализаций.
   */
  @Get('specializations')
  async getSpecializationsFilter(): Promise<IFiltersResponse> {
    return await this.filtersService.getSpecializationsFilter();
  }

  /**
   * Получение фильтров для программ.
   * @returns - Фильтры программ.
   */
  @Get('programs')
  async getProgramsFilter(): Promise<IFiltersResponse> {
    return await this.filtersService.getProgramsFilter();
  }

  /**
   * Получение фильтров для квалификаций.
   * @returns - Фильтры квалификаций.
   */
  @Get('qualifications')
  getQualificationsFilter(): IFiltersResponse {
    return this.filtersService.getQualificationsFilter();
  }

  /**
   * Получение фильтров для формата работы.
   * @returns - Фильтры формата работы.
   */
  @Get('format')
  getFormatFilter(): IFiltersResponse {
    return this.filtersService.getFormatFilter();
  }

  /**
   * Получение фильтров для опыта работы.
   * @returns - Фильтры опыта работы.
   */
  @Get('experience')
  getExperienceFilter(): IFiltersResponse {
    return this.filtersService.getExperienceFilter();
  }

  /**
   * Получение фильтров для участия в проектах.
   * @returns - Фильтры участия в проектах.
   */
  @Get('involvement')
  getInvolvementFilter(): IFiltersResponse {
    return this.filtersService.getInvolvementFilter();
  }
}
