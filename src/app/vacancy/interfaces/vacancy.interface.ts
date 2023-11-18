import { AuthorStatus } from '../consts';

export interface IVacancy {
  id: string;
  title: string;
  remote: boolean;
  status: AuthorStatus;
  gender: string;
  minCost: number;
  maxCost: number;

  feedbackLink: string;
  authorId: string;

  specializations: string[];
  narrowSpecializations: string[];
  programs: string[];
  courses: string[];
}
