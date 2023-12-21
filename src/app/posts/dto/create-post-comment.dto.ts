import { Types } from 'mongoose';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsString } from 'class-validator';

import { PostCommentDto } from '@app/posts/dto/post-comment.dto';

export class CreatePostCommentDto extends PartialType(PostCommentDto) {
  @IsMongoId()
  @ApiProperty({ default: '' })
  postId: Types.ObjectId;

  @IsString()
  @ApiProperty({ default: 'Текст комментария...' })
  cText: string;

  @IsArray()
  @ApiProperty({ default: [] })
  cImg?: string[];
}
