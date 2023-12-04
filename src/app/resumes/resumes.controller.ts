import { Controller, Get, Param, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { ResumesService } from './resumes.service';

import { UserId } from '@shared/decorators/user-id.decorator';
import { JwtAuthGuard } from '@app/auth/guards/jwt.guard';
import { ICrudResumeParams } from '@app/resumes/interfaces/crud-resume.interface';
import { IResume } from './interfaces/resume.interface';
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
  async create(
    @UserId() userId: Types.ObjectId,
    @Query() resumeParams: ICrudResumeParams,
  ): Promise<IResume | IResume[]> {
    return await this.resumesService.update(userId, resumeParams);
  }

  /**
   * Получение всех резюме.
   * @returns - Все резюме.
   */
  @Get('list')
  async findAll(): Promise<IResume[]> {
    return await this.resumesService.findAll();
  }

  /**
   * Получение всех резюме пользователя.
   * @param params.userId - id автора.
   * @returns - Список всех резюме пользователя.
   */
  @Get('list/:userId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiParam({ name: 'userId', description: 'User ID' })
  async findAllByUserId(@Param() params: IFindAllResumeParams): Promise<IResume[]> {
    return await this.resumesService.findAllByUserId(params);
  }

  /**
   * Получение резюме пользователя по id.
   * @param params.userId - id автора.
   * @param params.id - id (гет курс) резюме.
   * @returns - Найденное резюме.
   */
  @Get(':userId/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiParam({ name: 'id', description: 'GetCourse Resume ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async findOneByIds(@Param() params: IFindOneResumeParams): Promise<IResume> {
    return await this.resumesService.findOneById(params);
  }
}
