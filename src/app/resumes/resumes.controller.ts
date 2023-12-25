import { Controller, Get, Logger, Param, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

import { ResumesService } from './resumes.service';

import { ICrudResumeParams } from '@app/resumes/interfaces/crud-resume.interface';
import { ResumeFindQueryDto } from '@app/resumes/dto/resume-find-query.dto';
import { IResume, IResumeResponse } from './interfaces/resume.interface';
import { IFindAllResumeParams, IFindOneResumeParams } from './interfaces/find-resume.interface';
import { JwtAuthGuard } from '@app/auth/guards/jwt-access.guard';

const logger = new Logger('VacancyController');

@ApiTags('Resumes')
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  /**
   * Создание или обновление резюме.
   * @param resumeParams - Данные для резюме.
   * @returns - Резюме.
   */
  @Post('update')
  @UsePipes(new ValidationPipe({ transform: true, enableDebugMessages: true }))
  async create(@Query() resumeParams: ICrudResumeParams): Promise<IResume | IResume[]> {
    try {
      return await this.resumesService.update(resumeParams);
    } catch (err) {
      logger.error(`Error while update controller: ${(err as Error).message}`);
    }
  }

  /**
   * Получение всех резюме.
   * @returns - Все резюме.
   */
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  @Get('list')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() queryParams?: ResumeFindQueryDto): Promise<IResumeResponse[]> {
    return await this.resumesService.findAll(queryParams);
  }

  /**
   * Получение всех резюме пользователя.
   * @param params.userId - id автора.
   * @returns - Список всех резюме пользователя.
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
    @Param() params: IFindAllResumeParams,
    @Query() query: ResumeFindQueryDto,
  ): Promise<IResumeResponse[]> {
    return await this.resumesService.findAllByUserId(params, query);
  }

  /**
   * Получение резюме пользователя по id.
   * @param params.userId - id автора.
   * @param params.id - id (гет курс) резюме.
   * @returns - Найденное резюме.
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
    description: 'Идентификатор резюме (GetCourse Id)',
  })
  async findOneByIds(@Param() params: IFindOneResumeParams): Promise<IResumeResponse> {
    return await this.resumesService.findOneById(params);
  }
}
