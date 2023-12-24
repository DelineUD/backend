import { Types } from 'mongoose';

export class ResumeDto {
  id: string; // Get course id
  author: Types.ObjectId;
  country: string;
  city: string;
  qualification: string;
  narrow_spec: string;
  remote_work: boolean;
  service_cost?: number;
  portfolio?: string;
}
