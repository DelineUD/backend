import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

import { PostCommentDto } from '@app/posts/dto/post-comment.dto';
import { Types } from 'mongoose';

export class DeletePostCommentDto extends PartialType(PostCommentDto) {
  @ApiProperty({ default: '' })
  @IsMongoId()
  @IsNotEmpty()
  postId: Types.ObjectId;

  @ApiProperty({ default: '' })
  @IsMongoId()
  @IsNotEmpty()
  commentId: Types.ObjectId;
}
