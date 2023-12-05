import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { PostCommentDto } from '@app/posts/dto/post-comment.dto';

export class UpdatePostCommentDto extends PartialType(PostCommentDto) {
  @ApiProperty({ default: '' })
  @IsMongoId()
  @IsNotEmpty()
  postId: string;

  @ApiProperty({ default: 'Текст...' })
  @IsOptional()
  @IsString()
  cText?: string;
}
