export class ResumeDto {
  id: string; // Get course id
  authorId: string; // Get course user id
  country: string;
  city: string;
  qualification: string;
  about: string;
  spec: string[];
  narrow_spec: string[];
  remote_work: boolean;
  service_cost?: number;
  portfolio?: string;
}
