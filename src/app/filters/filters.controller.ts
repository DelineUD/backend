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
      await this.filtersService.getProgramsFilter(),
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
   * Получение фильтров для программ.
   * @returns - Фильтры программ.
   */
  @Get('programs')
  async getProgramsFilter(): Promise<IFilters> {
    return await this.filtersService.getProgramsFilter();
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
