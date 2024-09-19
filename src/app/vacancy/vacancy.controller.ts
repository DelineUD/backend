import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'mongodb';
import { Types } from 'mongoose';

import { UserId } from '@shared/decorators/user-id.decorator';
import { JwtAuthGuard } from '@app/auth/guards/jwt-access.guard';
import { VacancyCreateDto } from './dto/vacancy-create.dto';
import { VacancyFindQueryDto } from '../vacancy/dto/vacancy-find-query.dto';
import { VacancyService } from './vacancy.service';
import { IVacancyListResponse, IVacancyResponse } from './interfaces/vacancy.interface';
import { IVacancyFindAll, IVacancyFindOne } from './interfaces/vacancy-find.interface';

@ApiTags('Vacancies')
@Controller('vacancies')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  /**
   * Создание новой вакансии
   * @param userId - идентификатор пользователя
   * @param createVacancyDto - данные для создания вакансии
   * @returns - вакансии
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @UserId() userId: Types.ObjectId,
    @Body() createVacancyDto: VacancyCreateDto,
  ): Promise<IVacancyResponse> {
    return await this.vacancyService.create(userId, createVacancyDto);
  }

  /**
   * Получение всех вакансий
   * @param userId - идентификатор пользователя
   * @param queryParams - параметры для поиска вакансий
   * @returns - все вакансии
   */
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @UserId() userId: Types.ObjectId,
    @Query() queryParams?: VacancyFindQueryDto,
  ): Promise<IVacancyListResponse[]> {
    return await this.vacancyService.findAll(userId, queryParams);
  }

  /**
   * Получение всех вакансий пользователя
   * @param params - параметры для поиска
   * @param query - параметры фильтров для поиска
   * @returns - список вакансий пользователя
   */
  @Get(':userId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'Системный идентификатор пользователя',
  })
  async findAllByUserId(
    @Param() params: IVacancyFindAll,
    @Query() { desc }: { desc: string | undefined },
  ): Promise<IVacancyListResponse[]> {
    return await this.vacancyService.findAllByUserId(params, { desc });
  }

  /**
   * Получение вакансии по id
   * @param params - параметры поиска вакансии
   * @returns - вакансия
   */
  @Get(':userId/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'Идентификатор пользователя',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Идентификатор вакансии',
  })
  async findById(@Param() params: IVacancyFindOne): Promise<IVacancyResponse> {
    return await this.vacancyService.findOneById(params);
  }

  /**
   * Удаление вакансии пользователя по идентификатору
   * @returns - резултат удаления
   * @param userId - идентификатор пользователя
   * @param id - идентификатор вакансии
   */
  @UsePipes(new ValidationPipe({ transform: true }))
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Системный идентификатор вакансии',
  })
  async deleteOneById(@UserId() userId: Types.ObjectId, @Param('id') id: string): Promise<DeleteResult> {
    return await this.vacancyService.deleteOneById(userId, id);
  }
}
