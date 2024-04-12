import { Controller, Get, Param, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { VacancyService } from './vacancy.service';
import { IVacancy, IVacancyResponse } from './interfaces/vacancy.interface';
import { IFindAllVacancyParams, IFindOneVacancyParams } from './interfaces/find-vacancy.interface';
import { ICrudVacancyParams } from '@app/vacancy/interfaces/crud-vacancy.interface';
import { JwtAuthGuard } from '@app/auth/guards/jwt-access.guard';
import { VacancyFindQueryDto } from '@app/vacancy/dto/vacancy-find-query.dto';
import { UserId } from '@shared/decorators/user-id.decorator';

@ApiTags('Vacancy')
@Controller('vacancy')
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  /**
   * Создание новой вакансии.
   * @param vacancyParams - данные для вакансии.
   * @returns - Вакансии.
   */
  @Post('update')
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Query() vacancyParams: ICrudVacancyParams): Promise<IVacancy | IVacancy[]> {
    return await this.vacancyService.update(vacancyParams);
  }

  /**
   * Получение всех вакансий.
   * @param userId - идентификатор пользователя.
   * @param queryParams - параметры для поиска вакансыий.
   * @returns - Все вакансии.
   */
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  @Get('list')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @UserId() userId: Types.ObjectId,
    @Query() queryParams?: VacancyFindQueryDto,
  ): Promise<IVacancyResponse[]> {
    return await this.vacancyService.findAll(userId, queryParams);
  }

  /**
   * Получение всех вакансий пользователя.
   * @param params - параметры для поиска.
   * @param query - параметры фильтров для поиска.
   * @returns - Список вакансий пользователя.
   */
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  @Get('list/:userId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'Системный идентификатор пользователя',
  })
  async findAllByUserId(
    @Param() params: IFindAllVacancyParams,
    @Query() query: VacancyFindQueryDto,
  ): Promise<IVacancyResponse[]> {
    return await this.vacancyService.findAllByUserId(params, query);
  }

  /**
   * Получение вакансии пользователя по id.
   * @param params.userId - Системный идентификатор пользователя.
   * @param params.id - Идентификатор вакансии.
   * @returns - Найденная вакансия.
   */
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  @Get(':userId/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'Системный идентификатор пользователя',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Идентификатор вакансии (GetCourse Id)',
  })
  async findByUserId(@Param() params: IFindOneVacancyParams): Promise<IVacancyResponse> {
    return await this.vacancyService.findByUserId(params);
  }
}
