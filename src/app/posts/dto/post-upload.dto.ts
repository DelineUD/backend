import { IsNotEmpty, IsString } from 'class-validator';

export class PostUploadDto {
  @IsString() @IsNotEmpty() postId: string;
  @IsString() @IsNotEmpty() authorId: string;
}
