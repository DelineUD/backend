import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  authorId: string;

  @IsNotEmpty()
  pText: string;

  group?: string;

  pImg?: Array<string>;

  stick?: boolean;
}
