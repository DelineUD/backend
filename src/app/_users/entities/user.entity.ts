import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IAdditional, IBun, IContact, IPreference, ISocial, IUser } from '../interfaces/user.interface';

@Schema({ collection: '_users', timestamps: true })
export class UserEntity extends Document implements IUser {
  @Prop({ required: true }) _id: Types.ObjectId;
  @Prop({ required: true }) phone: string;
  @Prop({ required: true }) email: string;
  @Prop({ required: true }) password: string;
  @Prop({ required: true }) first_name: string;
  @Prop({ required: true }) last_name: string;
  @Prop({ required: true }) birthday: Date;
  @Prop() avatar?: string;
  @Prop({
    type: { city: String, country: String },
    _id: false,
    required: true,
  })
  contact_info: IContact;
  @Prop({
    type: {
      remote_work: Boolean,
      ready_communicate: Boolean,
      status: String,
      qualification: String,
      about: String,
    },
    _id: false,
    required: true,
  })
  additional_info: IAdditional;
  @Prop({
    type: {
      blocked_users: [{ type: Types.ObjectId, ref: 'User' }],
      hidden_authors: [{ type: Types.ObjectId, ref: 'User' }],
      hidden_posts: [{ type: Types.ObjectId, ref: 'Post' }],
    },
    _id: false,
  })
  bun_info?: IBun;
  @Prop({
    type: {
      is_hide_phone: Boolean,
      is_hide_birthday: Boolean,
    },
    _id: false,
    required: true,
  })
  preferences: IPreference;
  @Prop({
    type: {
      telegram: String,
      instagram: String,
      vk: String,
      site: String,
    },
    _id: false,
  })
  socials?: ISocial;
  @Prop({ type: [String] }) courses?: string[];
  @Prop({ type: [String] }) programs?: string[];
  @Prop({ type: [String] }) specializations?: string[];
  @Prop({ type: [String] }) narrow_specializations?: string[];
  @Prop() is_eula_approved?: boolean;
  @Prop() getcourse_id?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
