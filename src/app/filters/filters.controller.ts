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
   * @returns - вызов.
   */
  @Post('update')
  async update(updateFiltersDto: UpdateFiltersDto): Promise<[] | PromiseSettledResult<unknown>[]> {
    return await this.filtersService.update(updateFiltersDto);
  }

  /**
   * Получение фильтров для стран.
   * @returns - Страны.
   */
  @Get('countries')
  async findCountries(): Promise<IFilters> {
    return await this.filtersService.findCountries();
  }

  /**
   * Получение фильтров для городов.
   * @returns - Города.
   */
  @Get('cities')
  async findCities(): Promise<IFilters> {
    return await this.filtersService.findCities();
  }

  /**
   * Получение фильтров для специализаций.
   * @returns - Города.
   */
  @Get('specializations')
  async findSpecializations(): Promise<IFilters> {
    return await this.filtersService.findSpecializations();
  }

  /**
   * Получение фильтров для узких специализаций.
   * @returns - Города.
   */
  @Get('narrow-specializations')
  async findNarrowSpecializations(): Promise<IFilters> {
    return await this.filtersService.findNarrowSpecializations();
  }

  /**
   * Получение фильтров для программ.
   * @returns - Города.
   */
  @Get('programs')
  async findPrograms(): Promise<IFilters> {
    return await this.filtersService.findPrograms();
  }

  /**
   * Получение фильтров для курсов.
   * @returns - Города.
   */
  @Get('courses')
  async findCourses(): Promise<IFilters> {
    return await this.filtersService.findCourses();
  }
}
