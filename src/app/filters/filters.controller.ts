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
   * Получение фильтров для стран.
   * @returns - Фильтры страны.
   */
  @Get('countries')
  async findCountries(): Promise<IFilters> {
    return await this.filtersService.findCountries();
  }

  /**
   * Получение фильтров для городов.
   * @returns - Фильтры городов.
   */
  @Get('cities')
  async findCities(): Promise<IFilters> {
    return await this.filtersService.findCities();
  }

  /**
   * Получение фильтров для специализаций.
   * @returns - Фильтры специализаций.
   */
  @Get('specializations')
  async findSpecializations(): Promise<IFilters> {
    return await this.filtersService.findSpecializations();
  }

  /**
   * Получение фильтров для узких специализаций.
   * @returns - Фильтры узких специализаций.
   */
  @Get('narrow-specializations')
  async findNarrowSpecializations(): Promise<IFilters> {
    return await this.filtersService.findNarrowSpecializations();
  }

  /**
   * Получение фильтров для программ.
   * @returns - Фильтры программ.
   */
  @Get('programs')
  async findPrograms(): Promise<IFilters> {
    return await this.filtersService.findPrograms();
  }

  /**
   * Получение фильтров для курсов.
   * @returns - Фильтры курсов.
   */
  @Get('courses')
  async findCourses(): Promise<IFilters> {
    return await this.filtersService.findCourses();
  }

  /**
   * Получение фильтров для постов.
   * @returns - Фильтры постов.
   */
  @Get('posts')
  public findPosts(): IFilters {
    return this.filtersService.findPosts();
  }
}
