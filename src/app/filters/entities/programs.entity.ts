import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'programs',
  timestamps: true,
})
export class Programs extends Document {
  @Prop({ required: true }) name: string;
}

export const ProgramsSchema = SchemaFactory.createForClass(Programs);
