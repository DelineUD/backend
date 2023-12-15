import { Types } from 'mongoose';

export class ResumeDto {
  // Resume information
  id: string;
  author: Types.ObjectId;
  country: string;
  city: string;
  qualification: string;
  narrow_spec: string;
  remote_work: boolean;
  service_cost?: number;
  portfolio?: string;
}
