import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { IComplaint } from '@app/complaints/interfaces/complaint.interface';
import { ComplaintTypes } from '@app/complaints/consts';

@Schema({
  collection: 'complaints-resume',
  timestamps: true,
})
export class ComplaintResume extends Document implements IComplaint {
  @Prop({ required: true }) type: ComplaintTypes.RESUME;
  @Prop({ required: true }) id: Types.ObjectId;
  @Prop({ required: true }) authorId: Types.ObjectId;
  @Prop({ required: true }) reason: string[];
}

export const ComplaintResumeSchema = SchemaFactory.createForClass(ComplaintResume);
