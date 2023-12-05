import { Types } from 'mongoose';

export class ResumeDto {
  // Resume information
  author: Types.ObjectId;
  id: string;
  qualification: string;
  narrow_spec: string;
  remote_work: boolean;
  service_cost?: number;
  portfolio?: string;
}
