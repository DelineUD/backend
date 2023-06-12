import { IsNotEmpty } from 'class-validator';

export class DeletePostDto {
  @IsNotEmpty()
  authorId?: string;

  @IsNotEmpty()
  _id: string;
}
