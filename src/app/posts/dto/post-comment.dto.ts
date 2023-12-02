import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PostCommentDto {
  @IsMongoId() @IsNotEmpty() postId: string;
  @IsOptional() @IsMongoId() author?: string;
  @IsOptional() @IsString() cText?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) cImg?: Array<string>;
  @IsOptional() @IsArray() @IsString({ each: true }) likes?: Array<string>;
  @IsOptional() @IsNumber() countLikes?: number;
}
