import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class PostCommentLikeDto {
  @ApiProperty({ default: '' })
  @IsMongoId()
  postId: Types.ObjectId;

  @ApiProperty({ default: '' })
  @IsMongoId()
  commentId: Types.ObjectId;
}
