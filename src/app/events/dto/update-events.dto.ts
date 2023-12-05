import { PartialType } from '@nestjs/swagger';

import { EventDto } from '@app/events/dto/event.dto';

export class UpdateEventsDto extends PartialType(EventDto) {}
