import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

import { PostCommentDto } from '@app/posts/dto/post-comment.dto';

export class CreatePostCommentDto extends PartialType(PostCommentDto) {
  @ApiProperty({ default: '' })
  @IsMongoId()
  postId: string;

  @ApiProperty({ default: 'Текст' })
  @IsString()
  cText: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  @IsOptional()
  files?: Express.Multer.File[];
}
