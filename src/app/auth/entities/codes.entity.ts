import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { ICodes } from '@app/auth/interfaces/codes.interface';

@Schema({
  collection: 'auth_codes',
  timestamps: true,
})
export class Codes extends Document implements ICodes {
  @Prop({ required: true }) userId: Types.ObjectId;
  @Prop({ required: true }) userPhone: string;
  @Prop({ required: true }) otp: number;
}

export const CodesSchema = SchemaFactory.createForClass(Codes).index({ createdAt: 1 }, { expireAfterSeconds: 10 });
