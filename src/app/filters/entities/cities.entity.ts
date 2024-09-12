import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IFilter } from '@app/filters/interfaces/filters.interface';

@Schema({
  collection: 'cities',
  timestamps: true,
})
export class CitiesEntity extends Document implements IFilter {
  @Prop({ required: true }) name: string;
}

export const CitiesSchema = SchemaFactory.createForClass(CitiesEntity);
