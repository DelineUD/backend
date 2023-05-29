export interface IPosts {
  _id?: string;

  authorId?: string;

  pText?: string;

  stick?: boolean;

  pImg?: Array<string>;

  likes?: Array<string>;

  views?: number;

  group?: string;

  countLikes?: number;

  isLiked?: boolean;

  createdAt?: Date;

  updatedAt?: Date;
}
