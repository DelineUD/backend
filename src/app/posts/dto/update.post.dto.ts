import { IsNotEmpty } from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  _id?: string;

  @IsNotEmpty()
  authorId?: string;

  @IsNotEmpty()
  pText?: string;

  group?: string;

  pImg?: Array<string>;

  stick?: boolean;

  views?: any;

  isLiked?: boolean;

  likes?: Array<string>;

  countLikes?: number;
}
