import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventsEntity } from './entities/events.entity';
import { EventsService } from './events.service';
import { IEvents } from './interfaces/events.interface';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('events')
@Controller('events')
@UseGuards(AuthGuard('jwt'))
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
  public async create(@Body() createEventDto: IEvents): Promise<IEvents> {
    const result = await this.EventsService.create(createEventDto);

    return result;
  }

  @Get('list')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'список постов',
    type: [EventsEntity],
  })
  public async gettList(@Request() data: any): Promise<any> {
    const result = await this.EventsService.getPostsList(data);
    return result;
  }

  @Get('by-month')
  async getUsers(@Query('month') month: string): Promise<any> {
    console.log(month);
    return month;
  }

  @Get(':_id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ивент по id',
    type: EventsEntity,
  })
  async getById(
    @Param() params: IEvents,
    @Request() data: any,
  ): Promise<IEvents> {
    const result = await this.EventsService.getEventById(params, data);
    return result;
  }
}
