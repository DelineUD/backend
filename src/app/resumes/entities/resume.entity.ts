import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IUser } from '@app/users/interfaces/user.interface';

@Schema({
  collection: 'resumes',
  timestamps: true,
})
export class Resume extends Document {
  @Prop({ required: true }) id: string;
  @Prop({ required: true }) title: string;
  @Prop({ type: Types.ObjectId, ref: 'UserModel' }) author: string | Types.ObjectId | IUser;
  @Prop() minCost?: number;
  @Prop() maxCost?: number;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
