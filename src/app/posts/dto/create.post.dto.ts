import {IsNotEmpty } from 'class-validator';


export class CreatePostDto {

  @IsNotEmpty()
  authorId: string;

  @IsNotEmpty()
  cDate: string;

  @IsNotEmpty()
  pText: string;
  stick?: string;
  pImg?: string;
  likes?: number;
  views?: number;

}
