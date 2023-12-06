import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'countries',
  timestamps: true,
})
export class Countries extends Document {
  @Prop({ required: true }) name: string;
}

export const CountriesSchema = SchemaFactory.createForClass(Countries);
