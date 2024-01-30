import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

import { Types } from 'mongoose';

import { PostCommentDto } from '@app/posts/dto/post-comment.dto';

export class DeletePostCommentDto extends PartialType(PostCommentDto) {
  @ApiProperty({ default: '' })
  @IsMongoId()
  postId: Types.ObjectId;

  @ApiProperty({ default: '' })
  @IsMongoId()
  commentId: Types.ObjectId;
}
