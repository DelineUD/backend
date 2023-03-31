export interface IPosts {
  _id?: string;

  authorId: string;

  pText: string;

  stick: boolean;

  pImg: string;

  likes: number;

  views: number;

  group: string;
}
