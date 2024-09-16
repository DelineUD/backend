import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { IFilter } from '@app/filters/interfaces/filters.interface';

@Schema({
  collection: 'job_experience',
  timestamps: true,
})
export class JobExperienceEntity extends Document implements IFilter {
  @Prop({ required: true }) name: string;
}

export const JobExperienceSchema = SchemaFactory.createForClass(JobExperienceEntity);
