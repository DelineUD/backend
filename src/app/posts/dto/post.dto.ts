import {IsNotEmpty } from 'class-validator';

export class PostDto {

  _id?:string;
  
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
  group?: string;


}
