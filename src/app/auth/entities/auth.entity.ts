import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  collection: 'auth',
  timestamps: true,
})
export class Auth extends Document {
  @Prop({ required: true }) userId: Types.ObjectId;
  @Prop({ required: false }) refreshToken: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
