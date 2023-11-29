import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PostDto {
  @IsNotEmpty() @IsString() _id: string;
  @IsNotEmpty() @IsString() author: string;
  @IsOptional() @IsString() pText?: string;
  @IsOptional() @IsString() group?: string;

  @IsOptional() @IsArray() pImg?: Array<string>;
  @IsOptional() @IsArray() likes?: Array<string>;
  @IsOptional() @IsArray() views?: Array<string>;

  @IsOptional() @IsNumber() countComments?: number;
  @IsOptional() @IsNumber() countLikes?: number;
}
