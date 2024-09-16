import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { IFilter } from '@app/filters/interfaces/filters.interface';

@Schema({
  collection: 'groups',
  timestamps: true,
})
export class GroupsEntity extends Document implements IFilter {
  @Prop({ required: true }) name: string;
}

export const GroupsSchema = SchemaFactory.createForClass(GroupsEntity);
