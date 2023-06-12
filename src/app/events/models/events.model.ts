import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IEvents } from '../interfaces/events.interface';

@Schema({ collection: 'events', timestamps: true })
export class EventsModel extends Document implements IEvents {
  [x: string]: any;

  @Prop({ required: false })
  authorId?: string;

  @Prop({ required: true })
  hText?: string;

  @Prop({ required: false })
  hImg?: string;

  @Prop({ required: false })
  startDate?: string;

  @Prop({ required: false })
  stopDate?: string;

  @Prop({ required: false })
  addr?: string;

  @Prop({ required: false })
  category?: string;

  @Prop({ required: false })
  access?: string;

  @Prop({ required: false })
  format?: string;

  @Prop({ required: false })
  bodyText?: string;
}

export const EventsSchema = SchemaFactory.createForClass(EventsModel);
