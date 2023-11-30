import { Controller, Get, Param, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

import { UserId } from '@shared/decorators/user-id.decorator';
import { VacancyService } from './vacancy.service';
import { IVacancy } from './interfaces/vacancy.interface';
import { IFindAllVacancyParams, IFindOneVacancyParams } from './interfaces/find-vacancy.interface';
import { ICrudVacancyParams } from '@app/vacancy/interfaces/crud-vacancy.interface';
import { JwtAuthGuard } from '@app/auth/guards/jwt.guard';

@ApiTags('Vacancy')
@Controller('vacancy')
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  /**
   * Создание новой вакансии.
   * @param userId - id пользователя.
   * @param vacancyParams - Данные для вакансии.
   * @returns - Вакансии.
   */
  @Post('update')
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async create(@UserId() userId: string, @Query() vacancyParams: ICrudVacancyParams): Promise<IVacancy | IVacancy[]> {
    return await this.vacancyService.update(userId, vacancyParams);
  }

  /**
   * Получение всех вакансий.
   * @returns - Все вакансии.
   */
  @Get('list')
  async findAll(): Promise<IVacancy[]> {
    return await this.vacancyService.findAll();
  }

  /**
   * Получение всех вакансий пользователя.
   * @param params.userId - id автора.
   * @returns - Список вакансий пользователя.
   */
  @Get('list/:userId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiParam({ name: 'userId', description: 'User ID' })
  async findAllByUserId(@Param() params: IFindAllVacancyParams): Promise<IVacancy[]> {
    return await this.vacancyService.findAllByUserId(params);
  }

  /**
   * Получение вакансии пользователя по id.
   * @param params.userId - id автора.
   * @param params.id - id вакансии.
   * @returns - Найденная вакансия.
   */
  @Get(':userId/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiParam({ name: 'id', description: 'Vacancy ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async findByUserId(@Param() params: IFindOneVacancyParams): Promise<IVacancy> {
    return await this.vacancyService.findByUserId(params);
  }
}
