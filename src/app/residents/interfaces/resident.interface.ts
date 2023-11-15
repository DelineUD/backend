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
  birthday: Date;
  gender: string;
  city_ru: string;
  citynru: string;
}

export interface IResident {
  _id: string;
  first_name: string;
  last_name: string;
  about: string;
  status: string;
  avatar?: string;
  personal_information: IPersonalInfoResident[];
  description_fields: IDescFieldsResident[];
}
