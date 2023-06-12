export class PostDto {
  _id?: string;

  authorId?: string;

  createdAt?: string;

  updatedAt?: string;

  pText?: string;

  stick?: boolean;

  pImg?: Array<string>;

  likes?: Array<string>;

  views?: number;

  group?: string;

  countLikes?: number;

  isLiked?: boolean;
}
