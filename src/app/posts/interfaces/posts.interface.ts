export interface IPosts {
  _id?: string;

  authorId: string;

  pText: string;

  stick: boolean;

  pImg?: Array<string>;

  likes?: Array<string>;

  views: number;

  group: string;

  isLiled?: boolean;

  countLikes?: number;
}
