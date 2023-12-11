export class IAllQueryFilters {
  country?: string;
  city?: string;
  status?: string;
  specializations?: string[];
  narrow_specializations?: string[];
  programs?: string[];
  courses?: string[];
  remote_work?: boolean;
  desc?: string | undefined;
}
