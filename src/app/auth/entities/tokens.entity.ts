import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  collection: 'auth_tokens',
  timestamps: true,
})
export class Tokens extends Document {
  @Prop({ required: true }) userId: Types.ObjectId;
  @Prop({ required: false }) refreshToken: string;
}

export const TokensSchema = SchemaFactory.createForClass(Tokens);
