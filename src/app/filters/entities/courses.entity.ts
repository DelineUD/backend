import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { IFilters } from '@app/filters/interfaces/filters.interface';

@Schema({
  collection: 'courses',
  timestamps: true,
})
export class Courses extends Document {
  @Prop({ required: true }) name: string;
}

export const CoursesSchema = SchemaFactory.createForClass(Courses);
