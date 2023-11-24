export class PostDto {
  _id?: string;

  author?: string;

  createdAt?: string;

  updatedAt?: string;

  pText?: string;

  pImg?: Array<string>;

  likes?: Array<string>;

  views?: Array<string>;

  group?: string;

  countLikes?: number;

  isLiked?: boolean;
}
