import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PostDto {
  @IsOptional() @IsMongoId() @IsNotEmpty() postId?: string;

  @IsOptional() @IsString() pText?: string;
  @IsOptional() @IsString() group?: string;

  @IsOptional() @IsArray() @IsString({ each: true }) pImg?: Array<string>;
  @IsOptional() @IsArray() @IsString({ each: true }) likes?: Array<string>;
  @IsOptional() @IsArray() @IsString({ each: true }) views?: Array<string>;

  @IsOptional() @IsNumber() countComments?: number;
  @IsOptional() @IsNumber() countLikes?: number;
}
