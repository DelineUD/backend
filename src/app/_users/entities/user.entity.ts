import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IAdditional, IBun, IContact, IPreference, ISocial, IUser } from '../interfaces/user.interface';

@Schema({ collection: '_users', timestamps: true })
export class UserEntity extends Document implements IUser {
  @Prop({ required: true }) phone: string;
  @Prop({ required: true }) email: string;
  @Prop({ required: true }) password: string;
  @Prop({ required: true }) first_name: string;
  @Prop({ required: true }) last_name: string;
  @Prop({ required: true }) birthday: Date;
  @Prop({ required: false }) avatar?: string;
  @Prop({
    type: { city: { type: String, required: true }, country: { type: String, required: false } },
    _id: false,
    required: true,
  })
  contact_info: IContact;
  @Prop({
    type: {
      format: { type: String, required: true },
      status: { type: String, required: true },
      qualification: { type: String, required: true },
      about: { type: String, required: false, maxlength: 1000 },
    },
    _id: false,
    required: true,
  })
  additional_info: IAdditional;
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
  @Prop({
    type: {
      is_hide_phone: { type: String, required: true },
      is_hide_birthday: { type: String, required: true },
    },
    _id: false,
    required: true,
  })
  preferences: IPreference;
  @Prop({
    type: {
      telegram: { type: String, required: false },
      instagram: { type: String, required: false },
      vk: { type: String, required: false },
      site: { type: String, required: false },
    },
    _id: false,
    required: false,
  })
  socials?: ISocial;
  @Prop({ type: [String], required: false }) courses?: string[];
  @Prop({ type: [String], required: false }) programs?: string[];
  @Prop({ type: [String], required: false }) specializations?: string[];
  @Prop({ type: [String], required: false }) narrow_specializations?: string[];
  @Prop({ type: Boolean, required: false }) is_eula_approved?: boolean;
  @Prop({ type: Boolean, required: false }) getcourse_id?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
