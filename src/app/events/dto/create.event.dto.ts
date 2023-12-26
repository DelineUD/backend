import { ApiProperty, PartialType } from '@nestjs/swagger';

import { Types } from 'mongoose';

import { EventDto } from '@app/events/dto/event.dto';

export class CreateEventsDto extends PartialType(EventDto) {
  @ApiProperty({ default: '' })
  eventId: Types.ObjectId;
  @ApiProperty({ default: '' })
  author: Types.ObjectId;
  @ApiProperty({ default: 'Новое событие...' })
  hText: string;
}
