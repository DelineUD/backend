import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { IFilter } from '@app/filters/interfaces/filters.interface';

@Schema({
  collection: 'job_formats',
  timestamps: true,
})
export class JobFormatsEntity extends Document implements IFilter {
  @Prop({ required: true }) name: string;
}

export const JobFormatsSchema = SchemaFactory.createForClass(JobFormatsEntity);
