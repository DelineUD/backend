export interface IEvents {
  _id?: string;

  authorId?: string;

  hText?: string;

  hImg?: string;

  startDate?: Date;

  addr?: string;

  category?: string;

  access?: string;

  format?: string;

  bodyText?: string;

  favor?: Array<string>;

  iGo?: Array<string>;

  notGo?: Array<string>;

  createdAt?: Date;

  updatedAt?: Date;

  stopDate?: Date;
}
