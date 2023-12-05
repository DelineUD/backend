import { Types } from 'mongoose';
import { PartialType } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

import { EventDto } from '@app/events/dto/event.dto';

export class DeleteEventsDto extends PartialType(EventDto) {
  @IsMongoId() @IsNotEmpty() eventId: Types.ObjectId;
  @IsMongoId() @IsNotEmpty() author: Types.ObjectId;
}
