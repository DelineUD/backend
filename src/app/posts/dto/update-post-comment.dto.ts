import { Types } from 'mongoose';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

import { PostCommentDto } from '@app/posts/dto/post-comment.dto';

export class UpdatePostCommentDto extends PartialType(PostCommentDto) {
  @ApiProperty({ default: '' })
  @IsMongoId()
  postId: Types.ObjectId;

  @ApiProperty({ default: 'Текст' })
  @IsOptional()
  @IsString()
  cText?: string;
}
