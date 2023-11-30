import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { IUser } from '@app/users/interfaces/user.interface';

@Schema({
  collection: 'users',
  timestamps: true,
})
export class UserModel extends Document implements IUser {
  @Prop() id?: string;

  // Personal Information
  @Prop({ required: true }) email: string;
  @Prop({ required: true }) phone: number;
  @Prop({ required: true }) password: string;
  @Prop({ required: true }) first_name: string;
  @Prop({ required: true }) last_name: string;
  @Prop() birthday?: Date;
  @Prop() avatar?: string;
  @Prop() gender?: string;
  @Prop() badge?: string;
  @Prop() cntry?: string;
  @Prop() vPass?: number;

  // Contact Information
  @Prop() city_ru?: string;
  @Prop() citynru?: string;

  // Additional Information
  @Prop() about?: string;
  @Prop() education?: string;
  @Prop() qualification?: string;
  @Prop() ready_communicate?: boolean;
  @Prop() remote_work?: boolean;
  @Prop() status?: string;

  // Social Media
  @Prop() service_cost?: number;
  @Prop() site?: string;
  @Prop() instagram?: string;
  @Prop() telegram?: string;
  @Prop() vk?: string;

  // Preferences
  @Prop() hide_phone?: boolean;
  @Prop() qualification_color?: string;

  // Courses
  @Prop() courses_new_app: string[];

  // Programs
  @Prop() programs_new_app: string[];

  // Specializations
  @Prop() specialization_new_app: string[];

  // Narrow Specializations
  @Prop() narrow_spec_new_app: string[];
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
