import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { IVacancy } from '@app/vacancy/interfaces/vacancy.interface';

@Schema({
  collection: 'vacancy',
  timestamps: true,
})
export class Vacancy extends Document implements IVacancy {
  @Prop({ required: true }) id: string; // Get course id
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) country: string;
  @Prop({ required: true }) city: string;
  @Prop({ required: true }) about: string;
  @Prop({ required: true }) specializations: string[];
  @Prop({ required: true }) narrow_specializations: string[];
  @Prop({ required: true }) programs: string[];
  @Prop({ required: true }) remote_work: boolean;
  @Prop() service_cost?: number;
  @Prop({ type: String, ref: 'UserModel' }) author: string; // Get course user id
}

export const VacancySchema = SchemaFactory.createForClass(Vacancy);
