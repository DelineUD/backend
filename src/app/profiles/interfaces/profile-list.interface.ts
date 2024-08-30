interface IProfileList {
  _id: string;
  first_name: string;
  last_name: string;
  avatar: string;
  city: string;
  is_blocked?: boolean;
  you_blocked?: boolean;
}

export type IProfileListResponse = IProfileList[];
