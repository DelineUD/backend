import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { IFilter } from '@app/filters/interfaces/filters.interface';

@Schema({
  collection: 'projects_involvement',
  timestamps: true,
})
export class ProjectsInvolvementEntity extends Document implements IFilter {
  @Prop({ required: true }) name: string;
}

export const ProjectsInvolvementSchema = SchemaFactory.createForClass(ProjectsInvolvementEntity);
