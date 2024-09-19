import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { IVacancy } from '@app/vacancy/interfaces/vacancy.interface';

@Schema({
  collection: 'vacancies',
  timestamps: true,
})
export class VacancyEntity extends Document implements IVacancy {
  @Prop() authorId: Types.ObjectId;
  @Prop() name: string;
  @Prop() job_experience: string;
  @Prop() job_format: string;
  @Prop() contacts: string;
  @Prop({ required: false }) about: string;
  @Prop({ required: false }) city: string;
  @Prop({ required: false }) payment: number[];
  @Prop({ required: false }) project_involvement: string;
  @Prop({ required: false }) programs: string[];
  @Prop({ required: false }) specializations: string[];
}

export const VacancySchema = SchemaFactory.createForClass(VacancyEntity);

VacancySchema.virtual('author', {
  ref: 'UserEntity',
  localField: 'authorId',
  foreignField: '_id',
  justOne: true,
});

VacancySchema.set('toObject', { virtuals: true });
VacancySchema.set('toJSON', { virtuals: true });
