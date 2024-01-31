import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

import { PostCommentDto } from '@app/posts/dto/post-comment.dto';

export class CreatePostCommentDto extends PartialType(PostCommentDto) {
  @ApiProperty({ default: '' })
  @IsMongoId()
  postId: string;

  @ApiProperty({ default: 'Текст' })
  @IsString()
  cText: string;

  @ApiProperty({ default: [] })
  @IsOptional()
  cImg?: string[];
}
