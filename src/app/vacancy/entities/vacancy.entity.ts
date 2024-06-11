import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { IVacancy } from '@app/vacancy/interfaces/vacancy.interface';

@Schema({
  collection: 'vacancy',
  timestamps: true,
})
export class Vacancy extends Document implements IVacancy {
  @Prop({ required: true }) id: string; // Get course id
  @Prop({ required: true }) authorId: Types.ObjectId; // Sys user _id
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) country: string;
  @Prop({ required: true }) city: string;
  @Prop({ required: false }) about: string;
  @Prop({ required: false }) other?: string;
  @Prop({ required: true }) format: string;
  @Prop({ required: true }) specializations: string[];
  @Prop({ required: true }) narrow_specializations: string[];
  @Prop({ required: true }) programs: string[];
}

export const VacancySchema = SchemaFactory.createForClass(Vacancy);

VacancySchema.virtual('author', {
  ref: 'UserModel',
  localField: 'authorId',
  foreignField: '_id',
  justOne: true,
});

VacancySchema.set('toObject', { virtuals: true });
VacancySchema.set('toJSON', { virtuals: true });
