import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

import { UserId } from '../shared/decorators/user-id.decorator';
import { VacancyService } from './vacancy.service';

import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { IVacancy } from './interfaces/vacancy.interface';
import { DeleteResult } from 'mongodb';

@ApiTags('Vacancy')
@Controller('vacancy')
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  /**
   * Создание новой вакансии.
   * @param createVacancyDto - Данные для создания вакансии.
   * @returns - Созданная вакансия.
   */
  @Post('create')
  @UsePipes(new ValidationPipe())
  async create(@Query() createVacancyDto: CreateVacancyDto) {
    return await this.vacancyService.create(createVacancyDto);
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
  @ApiParam({ name: 'userId', description: 'User ID' })
  async findAllByUserId(@Param() params: { userId: string }): Promise<IVacancy[]> {
    return await this.vacancyService.findAllByUserId(params);
  }

  /**
   * Получение вакансии пользователя по id.
   * @param params.userId - id автора.
   * @param params.id - id вакансии.
   * @returns - Найденная вакансия.
   */
  @Get(':userId/:id')
  @ApiParam({ name: 'id', description: 'Vacancy ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async findByUserId(@Param() params: { userId: string; id: string }): Promise<IVacancy> {
    return await this.vacancyService.findByUserId(params);
  }

  /**
   *  Обновление вакансии пользователя.
   * @param userId - id пользователя.
   * @param id - id вакансии.
   * @param updateVacancyDto - Данные для обновления вакансии.
   * @returns - Обновленная вакансия.
   */
  @Patch(':id')
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', description: 'Vacancy ID' })
  async update(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() updateVacancyDto: UpdateVacancyDto,
  ): Promise<IVacancy> {
    return this.vacancyService.update(userId, id, updateVacancyDto);
  }

  /**
   * Удаление вакансии пользователя.
   * @param userId - id пользователя.
   * @param id - id вакансии.
   * @returns - Вакансии пользователя.
   */
  @Delete(':id')
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', description: 'Vacancy ID' })
  async remove(@UserId() userId: string, @Param('id') id: string): Promise<DeleteResult> {
    return this.vacancyService.remove(userId, id);
  }
}
