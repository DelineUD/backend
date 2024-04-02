import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { IUser } from '@app/users/interfaces/user.interface';

@Schema({
  collection: 'users',
  timestamps: true,
})
export class UserModel extends Document implements IUser {
  @Prop({ required: true, type: String }) id: string;

  // Personal Information
  @Prop({ required: true }) email: string;
  @Prop({ required: true }) phone: string;
  @Prop({ required: true }) password: string;
  @Prop({ required: true }) first_name: string;
  @Prop({ required: true }) last_name: string;
  @Prop() birthday: Date;
  @Prop() avatar?: string;
  @Prop() gender?: string;
  @Prop() badge?: string;

  // Contact Information
  @Prop() country: string;
  @Prop() city: string;

  // Additional Information
  @Prop() about?: string;
  @Prop() education?: string;
  @Prop() qualification?: string;
  @Prop() ready_communicate?: boolean;
  @Prop() remote_work: boolean;
  @Prop() status: string;

  // Social Media
  @Prop() site?: string;
  @Prop() instagram?: string;
  @Prop() telegram?: string;
  @Prop() vk?: string;

  // Preferences
  @Prop() hide_phone: boolean;
  @Prop() isEuaApproved?: boolean;
  @Prop() qualification_color?: string;

  // Courses
  @Prop() courses: string[];

  // Programs
  @Prop() programs: string[];

  // Specializations
  @Prop() specializations: string[];

  // Narrow Specializations
  @Prop() narrow_specializations: string[];
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
