import { Types } from 'mongoose';

// Description filed without label
export type Item = string[];

// Description filed with label
export type ItemLabel = {
  label: string;
  value: string;
};

export interface IDescFieldsResident {
  filed: string;
  items: Item | ItemLabel[];
}

export interface IPersonalInfoResident {
  country: string;
  city: string;
  email: string;
  phone: string | null;
  site: string | null;
  birthday?: Date | null;
  gender?: string | null;
  contact_link?: string | null;
}

export interface IResident {
  _id: Types.ObjectId;
  first_name: string;
  last_name: string;
  about: string | null;
  status: string | null;
  qualification: string | null;
  avatar?: string | null;
  personal_information: IPersonalInfoResident;
  description_fields: IDescFieldsResident[];
}
