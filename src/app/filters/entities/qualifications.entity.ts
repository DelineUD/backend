import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { IFilter } from '@app/filters/interfaces/filters.interface';

@Schema({
  collection: 'qualifications',
  timestamps: true,
})
export class Qualifications extends Document implements IFilter {
  @Prop({ required: true }) name: string;
}

export const QualificationsSchema = SchemaFactory.createForClass(Qualifications);
