import { Types } from 'mongoose';
import { IsMongoId } from 'class-validator';

export class DeleteEventsDto {
  @IsMongoId()
  eventId: Types.ObjectId;
}
