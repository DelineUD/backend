import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IAdditional, IBun, ILink, IPreference, IUser } from '../interfaces/user.interface';
import { EUserJobFormat } from '@shared/consts/user-format.enum';
import { EUserJobExperience } from '@shared/consts/user-experience.enum';
import { EUserProjectInvolvement } from '@shared/consts/user-involvement.enum';

@Schema({ collection: 'users', timestamps: true })
export class UserEntity extends Document implements IUser {
  @Prop({ required: true }) phone: string;
  @Prop({ required: true }) email: string;
  @Prop({ required: true }) password: string;
  @Prop({ required: true }) first_name: string;
  @Prop({ required: true }) last_name: string;
  @Prop({ required: false }) avatar?: string;
  @Prop({ required: false }) city?: string;
  @Prop({ required: false, type: [{ url: String, name: String }], _id: false }) links?: ILink[];
  @Prop({
    type: {
      about: { type: String, required: false, maxlength: 300 },
      qualifications: {
        type: [{ name: String, year: { type: Number, required: false }, _id: false }],
        required: false,
      },
      project_involvement: { type: String, enum: EUserProjectInvolvement, required: false },
      job_format: { type: String, enum: EUserJobFormat, required: false },
      job_experience: { type: String, enum: EUserJobExperience, required: false },
      keywords: { type: [String], required: false },
    },
    _id: false,
    required: true,
  })
  additional_info: IAdditional;
  @Prop({
    type: {
      is_hide_phone: { type: Boolean, required: false },
      is_eula_approved: { type: Boolean, required: false },
    },
    _id: false,
    required: true,
  })
  preferences?: IPreference;
  @Prop({
    type: {
      blocked_users: { type: [{ type: Types.ObjectId, ref: 'User' }], required: false },
      hidden_authors: { type: [{ type: Types.ObjectId, ref: 'User' }], required: false },
      hidden_posts: { type: [{ type: Types.ObjectId, ref: 'Post' }], required: false },
    },
    _id: false,
    required: false,
  })
  bun_info?: IBun;
  @Prop({ type: [String], required: false }) programs?: string[];
  @Prop({ type: String, required: false }) specialization?: string;
  @Prop({ type: String, required: false }) getcourse_id?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
