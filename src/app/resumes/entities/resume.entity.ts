import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IResume } from '@app/resumes/interfaces/resume.interface';

@Schema({
  collection: 'resumes',
  timestamps: true,
})
export class Resume extends Document implements IResume {
  @Prop({ required: true }) id: string;
  @Prop({ required: true }) qualification: string[];
  @Prop({ required: true }) narrow_spec: string[];
  @Prop({ required: true }) remote_work: boolean;
  @Prop({ required: true }) country: string;
  @Prop({ required: true }) city: string;
  @Prop() service_cost?: number;
  @Prop() portfolio?: string;
  @Prop({ type: Types.ObjectId, ref: 'UserModel' }) author: Types.ObjectId;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
