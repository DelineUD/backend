import { IsNotEmpty } from 'class-validator';

export class PostDto {
  _id?: string;

  @IsNotEmpty()
  authorId: string;

  createdAt?: string;

  updatedAt?: string;

  @IsNotEmpty()
  pText: string;

  stick?: boolean;

  pImg?: Array<string>;

  likes?: Array<string>;

  views?: number;

  group?: string;

  countLikes?: number;

  isLiked?: boolean;
}
