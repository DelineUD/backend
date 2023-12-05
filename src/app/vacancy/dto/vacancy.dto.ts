import { Types } from 'mongoose';

export class VacancyDto {
  // Vacancy information
  author: Types.ObjectId;
  id: string;
  name: string;
  qualification: string;
  narrow_spec: string;
  need_programs: string;
  remote_work: boolean;
  service_cost?: number;
}
