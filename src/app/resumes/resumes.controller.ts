import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'mongodb';
import { Types } from 'mongoose';

import { UserId } from '@shared/decorators/user-id.decorator';
import { JwtAuthGuard } from '@app/auth/guards/jwt-access.guard';
import { FiltersService } from '@app/filters/filters.service';
import { IFiltersResponse } from '@app/filters/interfaces/filters.interface';
import { ResumeFindQueryDto } from './dto/resume-find-query.dto';
import { ResumesService } from './resumes.service';
import { ResumeCreateDto } from './dto/resume-create.dto';
import { IResumeResponse, IResumeListResponse } from './interfaces/resume.interface';

@ApiTags('Resumes')
@Controller('resumes')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
export class ResumesController {
  constructor(private readonly resumesService: ResumesService, private filtersService: FiltersService) {}

  /**
   * Создание нового резюме
   * @param userId - идентификатор пользователя
   * @param createResumeDto - данные для создания резюме
   * @returns - новое резюме
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@UserId() userId: Types.ObjectId, @Body() createResumeDto: ResumeCreateDto): Promise<IResumeResponse> {
    return await this.resumesService.create(userId, createResumeDto);
  }

  /**
   * Обновление резюме
   * @param userId - идентификатор пользователя
   * @param id - идентификатор резюме
   * @param updateResumeDto - данные для обновления резюме
   * @returns - обновленное резюме
   */
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @UserId() userId: Types.ObjectId,
    @Param('id') id: string,
    @Body() updateResumeDto: ResumeCreateDto,
  ): Promise<IResumeResponse> {
    return await this.resumesService.update(userId, id, updateResumeDto);
  }

  /**
   * Получение фильтров для резюме
   * @returns - фильтры для резюме
   */
  @Get('filters')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getResumeFilters(): Promise<IFiltersResponse[]> {
    return Promise.all([
      this.filtersService.getCitiesFilter(),
      this.filtersService.getSpecializationsFilter(),
      this.filtersService.getProgramsFilter(),
      this.filtersService.getQualificationsFilter(),
      this.filtersService.getFormatFilter(),
      this.filtersService.getExperienceFilter(),
      this.filtersService.getInvolvementFilter(),
    ]);
  }

  /**
   * Получение всех резюме
   * @param userId - идентификатор пользователя
   * @param queryParams - параметры для поиска резюме
   * @returns - все резюме
   */
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @UserId() userId: Types.ObjectId,
    @Query() queryParams?: ResumeFindQueryDto,
  ): Promise<IResumeListResponse> {
    return await this.resumesService.findAll(userId, queryParams);
  }

  /**
   * Получение всех резюме пользователя
   * @param params - параметры для поиска
   * @param query - параметры фильтров для поиска
   * @returns - список резюме пользователя
   */
  @Get(':userId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'Системный идентификатор пользователя',
  })
  async findAllByUserId(
    @Param() params: { userId: string },
    @Query() { desc }: { desc: string | undefined },
  ): Promise<IResumeListResponse> {
    return await this.resumesService.findAllByUserId(params, { desc });
  }

  /**
   * Получение резюме по id
   * @param params - параметры поиска резюме
   * @returns - резюме
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
    description: 'Идентификатор резюме',
  })
  async findById(@Param() params: { userId: string; id: string }): Promise<IResumeResponse> {
    return await this.resumesService.findOneById(params);
  }

  /**
   * Удаление резюме пользователя по идентификатору
   * @returns - результат удаления
   * @param userId - идентификатор пользователя
   * @param id - идентификатор резюме
   */
  @UsePipes(new ValidationPipe({ transform: true }))
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Системный идентификатор резюме',
  })
  async deleteOneById(@UserId() userId: Types.ObjectId, @Param('id') id: string): Promise<DeleteResult> {
    return await this.resumesService.deleteOneById(userId, id);
  }
}
