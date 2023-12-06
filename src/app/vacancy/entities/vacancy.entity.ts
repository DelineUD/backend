import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { IVacancy } from '@app/vacancy/interfaces/vacancy.interface';

@Schema({
  collection: 'vacancy',
  timestamps: true,
})
export class Vacancy extends Document implements IVacancy {
  @Prop({ required: true }) id: string;
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) qualification: string[];
  @Prop({ required: true }) narrow_spec: string[];
  @Prop({ required: true }) need_programs: string[];
  @Prop({ required: true }) remote_work: boolean;
  @Prop() country?: string;
  @Prop() city?: string;
  @Prop() service_cost?: number;
  @Prop({ type: Types.ObjectId, ref: 'UserModel' }) author: Types.ObjectId;
}

export const VacancySchema = SchemaFactory.createForClass(Vacancy);
