import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty() author: string;
  @IsOptional() @IsString() pText?: string;
  @IsOptional() @IsString() group?: string;
  @IsOptional() pImg?: Array<string>;
}
