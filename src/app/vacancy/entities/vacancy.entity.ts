import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AuthorStatus } from '../consts';
import { IUser } from '../../users/interfaces/user.interface';

@Schema({
  collection: 'vacancy',
  timestamps: true,
})
export class Vacancy extends Document {
  @Prop({ required: true }) id: string;
  @Prop({ required: true }) title: string;
  @Prop() description?: string;
  @Prop({ required: true }) remote: boolean;
  @Prop({ required: true }) status: AuthorStatus;
  @Prop() gender?: string;
  @Prop() minCost?: number;
  @Prop() maxCost?: number;
  @Prop({ required: true }) feedbackLink: string;
  @Prop() specializations: string[];
  @Prop() narrowSpecializations: string[];
  @Prop() programs: string[];
  @Prop() courses: string[];
  @Prop({ type: Types.ObjectId, ref: 'UserModel' }) author: string | Types.ObjectId | IUser;
}

export const VacancySchema = SchemaFactory.createForClass(Vacancy);