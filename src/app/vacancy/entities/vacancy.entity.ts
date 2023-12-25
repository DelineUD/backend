import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { IVacancy, IVacancyAuthorResponse } from '@app/vacancy/interfaces/vacancy.interface';
import { UserModel } from '@app/users/models/user.model';

@Schema({
  collection: 'vacancy',
  timestamps: true,
})
export class Vacancy extends Document implements IVacancy {
  @Prop({ required: true }) id: string; // Get course id
  @Prop({ required: true }) authorId: string; // Get course user id
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) country: string;
  @Prop({ required: true }) city: string;
  @Prop({ required: true }) about: string;
  @Prop({ required: true }) specializations: string[];
  @Prop({ required: true }) narrow_specializations: string[];
  @Prop({ required: true }) programs: string[];
  @Prop({ required: true }) remote_work: boolean;
  @Prop({ required: false }) service_cost?: number;
}

export const VacancySchema = SchemaFactory.createForClass(Vacancy);

VacancySchema.virtual('author', {
  ref: 'UserModel',
  localField: 'authorId',
  foreignField: 'id',
  justOne: true,
});

VacancySchema.set('toObject', { virtuals: true });
VacancySchema.set('toJSON', { virtuals: true });
