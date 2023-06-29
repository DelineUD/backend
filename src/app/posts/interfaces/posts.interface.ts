export interface IPosts {
  _id?: string;

  authorId?: string;

  pText?: string;

  stick?: boolean;

  pImg?: Array<string>;

  likes?: Array<string>;

  views?: Array<string>;

  views_count?: number;

  isViewed?: boolean;

  group?: string;

  countLikes?: number;

  isLiked?: boolean;

  createdAt?: Date;

  updatedAt?: Date;

  countComments?: number;
}
