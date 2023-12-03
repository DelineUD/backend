import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class IPostsCommentsFindParams {
  @ApiProperty({ default: '' })
  @IsMongoId()
  @IsNotEmpty()
  postId: string;

  @ApiProperty({ default: '' })
  @IsMongoId()
  @IsNotEmpty()
  commentId: string;
}
