import { Controller, Delete, Get, Param, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'mongodb';
import { Types } from 'mongoose';

import { UserId } from '@shared/decorators/user-id.decorator';
import { JwtAuthGuard } from '@app/auth/guards/jwt-access.guard';
import { ICrudResumeParams } from '@app/resumes/interfaces/crud-resume.interface';
import { ResumeFindQueryDto } from '@app/resumes/dto/resume-find-query.dto';
import { IDeleteResumeQuery } from '@app/resumes/interfaces/delete-resume.interface';
import { ResumesService } from './resumes.service';
import { IResume, IResumeResponse } from './interfaces/resume.interface';
import { IFindAllResumeParams, IFindOneResumeParams } from './interfaces/find-resume.interface';

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
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Query() resumeParams: ICrudResumeParams): Promise<IResume | IResume[]> {
    return await this.resumesService.update(resumeParams);
  }

  /**
   * Получение всех резюме.
   * @param userId - идентификатор пользователя.
   * @param queryParams - параметры для поиска резюме.
   * @returns - Все резюме.
   */
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  @Get('list')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @UserId() userId: Types.ObjectId,
    @Query() queryParams?: ResumeFindQueryDto,
  ): Promise<IResumeResponse[]> {
    return await this.resumesService.findAll(userId, queryParams);
  }

  /**
   * Получение всех резюме пользователя.
   * @param params.userId - идентификатор пользователя.
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
   * @param params.userId - идентификатор пользователя.
   * @param params.id - идентификатор (гет курс) резюме.
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

  /**
   * Удаление резюме пользователя по идентификатору.
   * @returns - Резултат удаления.
   * @param userId - Идентификатор пользователя
   * @param id - Идентификатор резюме
   */
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Delete('delete/:id')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Системный идентификатор резюме',
  })
  async deleteOneById(@UserId() userId: Types.ObjectId, @Param('id') id: Types.ObjectId): Promise<DeleteResult> {
    return await this.resumesService.deleteOneById(userId, id);
  }

  /**
   * Удаление резюме пользователя c Get Course.
   * @returns - Резултат удаления.
   * @param query - параметры для удаления
   */
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('delete')
  async deleteByGetCoursePayload(@Query() query: IDeleteResumeQuery): Promise<DeleteResult> {
    return await this.resumesService.deleteByGetCoursePayload(query);
  }
}
