import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { IComplaint, IComplaintsResponse } from '@app/complaints/interfaces/complaint.interface';
import { JwtAuthGuard } from '@app/auth/guards/jwt-access.guard';
import { UserId } from '@shared/decorators/user-id.decorator';

@ApiTags('Complaints')
@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  /**
   * Создание жалобы.
   * @returns - void.
   */
  @Post('create')
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@UserId() userId: Types.ObjectId, @Body() createComplaintDto: CreateComplaintDto): Promise<void> {
    return this.complaintsService.create(userId, createComplaintDto);
  }

  /**
   * Получение списка вариантов для жалоб.
   * @returns - список вариантов.
   */
  @Get()
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  getComplaints(): IComplaintsResponse[] {
    return this.complaintsService.getComplaints();
  }

  /**
   * Получение всех жалоб.
   * @returns - список жалоб.
   */
  @Get('list')
  async findAll(): Promise<IComplaint[]> {
    return await Promise.all([
      ...(await this.complaintsService.findAllPostComplaints()),
      ...(await this.complaintsService.findAllResumeComplaints()),
      ...(await this.complaintsService.findAllVacancyComplaints()),
    ]);
  }

  /**
   * Получение всех жалоб на посты.
   * @returns - список жалоб.
   */
  @Get('posts/list')
  async findAllPosts(): Promise<IComplaint[]> {
    return await this.complaintsService.findAllPostComplaints();
  }

  /**
   * Получение всех жалоб на резюме.
   * @returns - список жалоб.
   */
  @Get('resumes/list')
  async findAllResumes(): Promise<IComplaint[]> {
    return await this.complaintsService.findAllResumeComplaints();
  }

  /**
   * Получение всех жалоб на вакансии.
   * @returns - список жалоб.
   */
  @Get('vacancies/list')
  async findAllVacancy(): Promise<IComplaint[]> {
    return await this.complaintsService.findAllVacancyComplaints();
  }

  /**
   * Получение всех жалоб пользователя.
   * @returns - все жалобы пользователя.
   */
  @Get('list/:authorId')
  @ApiParam({
    name: 'authorId',
    type: 'string',
    description: 'Системный идентификатор автора',
  })
  findAllByAuthorId(@Param('authorId') authorId: Types.ObjectId) {
    return this.complaintsService.findAllByAuthorId(authorId);
  }
}
