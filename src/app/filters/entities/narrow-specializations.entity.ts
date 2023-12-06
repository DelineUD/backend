import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'narrow_specialization',
  timestamps: true,
})
export class NarrowSpecializations extends Document {
  @Prop({ required: true }) name: string;
}

export const NarrowSpecializationSchema = SchemaFactory.createForClass(NarrowSpecializations);
