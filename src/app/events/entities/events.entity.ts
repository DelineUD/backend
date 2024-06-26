import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IEvents } from '@app/events/interfaces/events.interface';

@Schema({
  collection: 'events',
  timestamps: true,
})
export class Events extends Document implements IEvents {
  @Prop() hText: string;
  @Prop() startDate: Date;
  @Prop() stopDate: Date;
  @Prop({ required: false }) hImg?: string;
  @Prop({ required: false }) addr?: string;
  @Prop({ required: false }) category?: string;
  @Prop({ required: false }) access?: string;
  @Prop({ required: false }) format?: string;
  @Prop({ required: false }) bodyText?: string;
  @Prop({ required: false }) favor?: Array<string>;
  @Prop({ required: false }) iGo?: Array<string>;
  @Prop({ required: false }) notGo?: Array<string>;
  @Prop({ type: Types.ObjectId, ref: 'UserModel' }) author: Types.ObjectId;
}

export const EventsSchema = SchemaFactory.createForClass(Events);
