import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { ObjectId, Types } from 'mongoose';

import { IEvents } from './interfaces/events.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-access.guard';
import { CreateEventsDto } from '@app/events/dto/create.event.dto';
import { UserId } from '@shared/decorators/user-id.decorator';
import { EventsService } from '@app/events/events.service';

@ApiTags('Events')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('create')
  public async create(@Body() createEvent: CreateEventsDto): Promise<IEvents> {
    return await this.eventsService.create(createEvent);
  }

  @Get('list')
  public async getList(@UserId() userId: Types.ObjectId): Promise<any> {
    return await this.eventsService.getEventsList(userId);
  }

  @Get('by-month')
  public async getEventListByMonth(
    @UserId() userId: Types.ObjectId,
    @Query('month') month: string,
    @Query('year') year: string,
  ): Promise<any> {
    return await this.eventsService.getEventsListByMonth(month, year, userId);
  }

  @Get(':_id')
  @ApiParam({
    name: '_id',
    description: 'Идентификатор события',
    required: true,
  })
  async getById(@Param() params: IEvents, @Request() data: any): Promise<IEvents> {
    const result = await this.eventsService.getEventById(params, data);
    return result;
  }

  @Post(':_id_event/igo/')
  @ApiParam({
    name: '_id_event',
    description: 'Идентификатор события',
    required: true,
  })
  async igo(@Param('_id_event') event_id: string, @Request() data: any): Promise<IEvents> {
    return await this.eventsService.EventIGo(event_id, data);
  }

  @Post(':_id_event/notgo/')
  @ApiParam({
    name: '_id_event',
    description: 'Идентификатор события',
    required: true,
  })
  async notgo(@Param('_id_event') event_id: string, @Request() data: any): Promise<IEvents> {
    return await this.eventsService.EventINotGo(event_id, data);
  }

  @Post(':_id_event/favor/')
  @ApiParam({
    name: '_id_event',
    description: 'Идентификатор события',
    required: true,
  })
  async favor(@Param('_id_event') event_id: string, @Request() data: any): Promise<IEvents> {
    return await this.eventsService.EventFavor(event_id, data);
  }
}
