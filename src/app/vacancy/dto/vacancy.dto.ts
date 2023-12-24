import { Types } from 'mongoose';

export class VacancyDto {
  id: string;
  author: Types.ObjectId;
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
