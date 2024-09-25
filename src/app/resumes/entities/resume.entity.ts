import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { IResume } from '@app/resumes/interfaces/resume.interface';

@Schema({
  collection: 'resumes',
  timestamps: true,
})
export class ResumeEntity extends Document implements IResume {
  @Prop() authorId: Types.ObjectId;
  @Prop() name: string;
  @Prop() job_experience: string;
  @Prop() job_format: string;
  @Prop() specialization: string;
  @Prop() contacts: string;
  @Prop({ required: false }) about: string;
  @Prop({ required: false }) city: string;
  @Prop({ required: false }) project_involvement: string;
  @Prop({ required: false }) qualifications: string[];
  @Prop({ required: false }) programs: string[];
}

export const ResumeSchema = SchemaFactory.createForClass(ResumeEntity);

ResumeSchema.virtual('author', {
  ref: 'UserEntity',
  localField: 'authorId',
  foreignField: '_id',
  justOne: true,
});

ResumeSchema.set('toObject', { virtuals: true });
ResumeSchema.set('toJSON', { virtuals: true });
