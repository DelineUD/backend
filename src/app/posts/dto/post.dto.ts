import { IsNotEmpty } from 'class-validator';

export class PostDto {
  _id?: string;

  @IsNotEmpty()
  authorId: string;

  createdAt?: string;

  updatedAt?: string;

  @IsNotEmpty()
  pText: string;

  stick?: string;

  pImg?: string;

  likes?: number;

  views?: number;

  group?: string;
}
