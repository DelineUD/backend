import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'cities',
  timestamps: true,
})
export class Cities extends Document {
  @Prop({ required: true }) name: string;
}

export const CitiesSchema = SchemaFactory.createForClass(Cities);
