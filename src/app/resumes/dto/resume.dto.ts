export class ResumeDto {
  id: string; // Get course id
  author: string; // Get course user id
  country: string;
  city: string;
  qualification: string;
  narrow_spec: string;
  remote_work: boolean;
  service_cost?: number;
  portfolio?: string;
}
