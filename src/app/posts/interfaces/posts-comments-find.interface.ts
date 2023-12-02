import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class IPostsCommentsFindParams {
  @ApiProperty({ default: '', required: false })
  @IsMongoId()
  @IsNotEmpty()
  commentId: string;
}
