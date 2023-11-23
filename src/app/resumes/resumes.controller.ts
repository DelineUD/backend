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
import { DeleteResult } from 'mongodb';
import { ResumesService } from './resumes.service';

import { UserId } from '../shared/decorators/user-id.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateResumeDto } from './dto/create-resume.dto';

@ApiTags('Resumes')
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  /**
   * Создание нового резюме.
   * @param createResumeDto - Данные для создания резюме.
   * @returns - Созданное резюме.
   */
  @Post('create')
  @UsePipes(new ValidationPipe())
  async create(@Query() createResumeDto: CreateResumeDto) {
    return await this.resumesService.create(createResumeDto);
  }

  /**
   * Получение всех резюме.
   * @returns - Все резюме.
   */
  @Get('list')
  async findAll(): Promise<any> {
    return await this.resumesService.findAll();
  }

  /**
   * Получение всех резюме пользователя.
   * @param params.userId - id автора.
   * @returns - Список всех резюме пользователя.
   */
  @Get('list/:userId')
  @ApiParam({ name: 'userId', description: 'User ID' })
  async findAllByUserId(@Param() params: { userId: string }): Promise<any> {
    return await this.resumesService.findAllByUserId(params);
  }

  /**
   * Получение резюме пользователя по id.
   * @param params.userId - id автора.
   * @param params.id - id резюме.
   * @returns - Найденное резюме.
   */
  @Get(':userId/:id')
  @ApiParam({ name: 'id', description: 'Resume ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async findOneByIds(@Param() params: { userId: string; id: string }): Promise<any> {
    return await this.resumesService.findOneByIds(params);
  }

  /**
   *  Обновление резюме пользователя.
   * @param userId - id пользователя.
   * @param id - id резюме.
   * @param updateResumeDto - Данные для обновления резюме.
   * @returns - Обновленное резюме.
   */
  @Patch(':id')
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', description: 'Resume ID' })
  async update(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() updateResumeDto: any,
  ): Promise<any> {
    return this.resumesService.update(userId, id, updateResumeDto);
  }

  /**
   * Удаление резюме пользователя.
   * @param userId - id резюме.
   * @param id - id резюме.
   * @returns - Резюме пользователя.
   */
  @Delete(':id')
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', description: 'Resume ID' })
  async remove(@UserId() userId: string, @Param('id') id: string): Promise<DeleteResult> {
    return this.resumesService.remove(userId, id);
  }
}
