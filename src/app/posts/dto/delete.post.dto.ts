import { IsNotEmpty } from 'class-validator';

export class DeletePostDto {
  @IsNotEmpty()
  author?: string;

  @IsNotEmpty()
  _id: string;
}
