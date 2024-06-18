import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteResult } from 'mongodb';
import { Types } from 'mongoose';

import { fileStorageConfig } from '@shared/storage/storage.config';
import { UserId } from '@shared/decorators/user-id.decorator';
import { CreateEventDto } from '@app/events/dto/create.event.dto';
import { EventsService } from '@app/events/events.service';
import { mediaFileFilter } from '@utils/mediaFileFilter';
import { JwtAuthGuard } from '../auth/guards/jwt-access.guard';
import { IEvents } from './interfaces/events.interface';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * Создание события.
   * @return - созданный пост
   * @param file - файл (картинка) события
   * @param createEventDto - данные события
   */
  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['hText', 'startDate', 'stopDate'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        author: { type: 'string' },
        hText: { type: 'string' },
        startDate: { type: 'string' },
        stopDate: { type: 'string' },
        addr: { type: 'string' },
        category: { type: 'string' },
        access: { type: 'string' },
        format: { type: 'string' },
        bodyText: { type: 'string' },
        favor: { type: 'array', items: { type: 'string' } },
        iGo: { type: 'array', items: { type: 'string' } },
        notGo: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileStorageConfig,
      fileFilter: mediaFileFilter,
    }),
  )
  public async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createEventDto: CreateEventDto,
  ): Promise<IEvents> {
    return await this.eventsService.create(file, createEventDto);
  }

  /**
   * Удаление события идентификатору.
   * @returns - резултат удаления.
   * @param userId - идентификатор пользователя
   * @param id - идентификатор события
   */
  @Delete('delete/:id')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Системный идентификатор события',
  })
  public async deleteOneById(@UserId() userId: Types.ObjectId, @Param('id') id: Types.ObjectId): Promise<DeleteResult> {
    return await this.eventsService.deleteOneById(userId, id);
  }

  /**
   * Получение списка событий.
   * @returns - резултат удаления.
   * @param userId - идентификатор пользователя
   */
  @Get('list')
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  public async getList(@UserId() userId: Types.ObjectId): Promise<IEvents[]> {
    return await this.eventsService.getEventsList(userId);
  }

  /**
   * Получение списка событий по дате.
   * @returns - резултат удаления.
   * @param userId - идентификатор пользователя
   * @param month - месяц
   * @param year - год
   */
  @Get('by-month')
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  public async getEventListByMonth(
    @UserId() userId: Types.ObjectId,
    @Query('month') month: string,
    @Query('year') year: string,
  ): Promise<IEvents[]> {
    return await this.eventsService.getEventsListByMonth(month, year, userId);
  }

  @Get(':_id')
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: '_id',
    description: 'Идентификатор события',
    required: true,
  })
  async getById(@Param() params: IEvents, @Request() data: any): Promise<IEvents> {
    return await this.eventsService.getEventById(params, data);
  }

  @Post(':_id_event/igo/')
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: '_id_event',
    description: 'Идентификатор события',
    required: true,
  })
  async igo(@Param('_id_event') event_id: string, @Request() data: any): Promise<IEvents> {
    return await this.eventsService.EventIGo(event_id, data);
  }

  @Post(':_id_event/notgo/')
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: '_id_event',
    description: 'Идентификатор события',
    required: true,
  })
  async notgo(@Param('_id_event') event_id: string, @Request() data: any): Promise<IEvents> {
    return await this.eventsService.EventINotGo(event_id, data);
  }

  @Post(':_id_event/favor/')
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: '_id_event',
    description: 'Идентификатор события',
    required: true,
  })
  async favor(@Param('_id_event') event_id: string, @Request() data: any): Promise<IEvents> {
    return await this.eventsService.EventFavor(event_id, data);
  }
}
