export class VacancyDto {
  id: string;
  author: string; // Get course id
  name: string;
  country: string;
  city: string;
  about: string;
  qualification: string;
  narrow_spec: string;
  need_programs: string;
  remote_work: boolean;
  service_cost?: number;
}
