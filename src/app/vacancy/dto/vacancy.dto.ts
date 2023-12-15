import { Types } from 'mongoose';

export class VacancyDto {
  // Vacancy information
  id: string;
  author: Types.ObjectId;
  name: string;
  country: string;
  city: string;
  qualification: string;
  narrow_spec: string;
  need_programs: string;
  remote_work?: boolean;
  service_cost?: number;
}
