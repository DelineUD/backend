import { IsMongoId, IsNotEmpty } from 'class-validator';

export class PostUploadDto {
  @IsMongoId() @IsNotEmpty() postId: string;
  @IsMongoId() @IsNotEmpty() authorId: string;
}
