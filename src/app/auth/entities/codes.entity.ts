import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { ICodes } from '@app/auth/interfaces/codes.interface';

@Schema({
  collection: '_auth_codes',
  timestamps: true,
})
export class Codes extends Document implements ICodes {
  @Prop({ required: true }) user_phone: string;
  @Prop({ required: true }) otp: number;
}

export const CodesSchema = SchemaFactory.createForClass(Codes);
