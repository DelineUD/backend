import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class IPostsCommentsFindParams {
  @ApiProperty({ default: '' })
  @IsMongoId()
  @IsNotEmpty()
  postId: Types.ObjectId;

  @ApiProperty({ default: '' })
  @IsMongoId()
  @IsNotEmpty()
  commentId: Types.ObjectId;
}
