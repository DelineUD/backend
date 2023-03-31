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

  pImg?: string;

  likes?: number;

  views?: number;

  group?: string;
}
