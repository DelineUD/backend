import { Body, Controller, Get, HttpStatus, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { EventsEntity } from './entities/events.entity';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { EventsService } from './events.service';
import { IEvents } from './interfaces/events.interface';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Events')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  constructor(private EventsService: EventsService) {}

  @Post('create')
  @ApiBody({
    description: 'Новывй ивент',
    type: EventsEntity,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ивент успешно создан',
    type: EventsEntity,
  })
  public async create(@Body() createEvent: IEvents): Promise<IEvents> {
    console.log(createEvent.stopDate);
    return await this.EventsService.create(createEvent);
  }

  @Get('list')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'список ивентов',
    type: [EventsEntity],
  })
  public async gettList(@Request() data: any): Promise<any> {
    return await this.EventsService.getEventsList(data);
  }

  @Get('by-month')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'список ивентов по месяцам',
    type: [EventsEntity],
  })
  public async getEventListByMonth(
    @Query('month') month: string,
    @Query('year') year: string,
    @Request() data: any,
  ): Promise<any> {
    return await this.EventsService.getEventsListByMonth(month, year, data.user._id);
  }

  @Get(':_id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ивент по id',
    type: EventsEntity,
  })
  async getById(@Param() params: IEvents, @Request() data: any): Promise<IEvents> {
    const result = await this.EventsService.getEventById(params, data);
    return result;
  }

  @Post(':_id_event/igo/')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Пойду',
    type: EventsEntity,
  })
  async igo(@Param('_id_event') event_id: any, @Request() data: any): Promise<IEvents> {
    return await this.EventsService.EventIGo(event_id, data);
  }

  @Post(':_id_event/notgo/')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Не пойду',
    type: EventsEntity,
  })
  async notgo(@Param('_id_event') event_id: any, @Request() data: any): Promise<IEvents> {
    return await this.EventsService.EventINotGo(event_id, data);
  }

  @Post(':_id_event/favor/')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Отметить евент звездочкой',
    type: EventsEntity,
  })
  async favor(@Param('_id_event') event_id: any, @Request() data: any): Promise<IEvents> {
    return await this.EventsService.EventFavor(event_id, data);
  }
}
