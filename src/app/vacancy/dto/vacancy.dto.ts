export class VacancyDto {
  id: string; // Get course id
  authorId: string; // Get course user id
  name: string;
  country: string;
  city: string;
  about: string;
  qualification: string;
  spec: string[];
  narrow_spec: string[];
  need_programs: string[];
  remote_work: boolean;
  service_cost?: number;
}
