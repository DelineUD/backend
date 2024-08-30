import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  collection: 'auth_tokens',
  timestamps: true,
})
export class Tokens extends Document {
  @Prop({ required: true }) user_id: Types.ObjectId;
  @Prop({ required: false }) refresh_token: string;
}

export const TokensSchema = SchemaFactory.createForClass(Tokens);
