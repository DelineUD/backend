import { Controller, Get, Param, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { ResumesService } from './resumes.service';

import { UserId } from '@shared/decorators/user-id.decorator';
import { JwtAuthGuard } from '@app/auth/guards/jwt-access.guard';
import { ICrudResumeParams } from '@app/resumes/interfaces/crud-resume.interface';
import { ResumeFindQueryDto } from '@app/resumes/dto/resume-find-query.dto';
import { IResume, IResumeResponse } from './interfaces/resume.interface';
import { IFindAllResumeParams, IFindOneResumeParams } from './interfaces/find-resume.interface';

@ApiTags('Resumes')
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  /**
   * Создание или обновление резюме.
   * @param userId - id пользователя.
   * @param resumeParams - Данные для резюме.
   * @returns - Резюме.
   */
  @Post('update')
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async create(@Query() resumeParams: ICrudResumeParams): Promise<IResume | IResume[]> {
    return await this.resumesService.update(resumeParams);
  }

  /**
   * Получение всех резюме.
   * @returns - Все резюме.
   */
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
    description: 'Системный идентификатор резюме',
  })
  async findOneByIds(@Param() params: IFindOneResumeParams): Promise<IResumeResponse> {
    return await this.resumesService.findOneById(params);
  }
}
