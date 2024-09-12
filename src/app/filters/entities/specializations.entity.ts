import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'specialization',
  timestamps: true,
})
export class SpecializationsEntity extends Document {
  @Prop({ required: true }) name: string;
}

export const SpecializationSchema = SchemaFactory.createForClass(SpecializationsEntity);
