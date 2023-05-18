export interface IPosts {
  _id?: string;

  authorId: string;

  pText: string;

  stick: boolean;

  pImg?: Array<string>;

  likes: number;

  views: number;

  group: string;
}
