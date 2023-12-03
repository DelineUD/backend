import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

import { PostCommentDto } from '@app/posts/dto/post-comment.dto';

export class CreatePostCommentDto extends PartialType(PostCommentDto) {
  @IsMongoId()
  @ApiProperty({ default: '' })
  postId: string;

  @IsString()
  @ApiProperty({ default: 'Текст комментария...' })
  cText?: string;

  @IsString()
  @ApiProperty({ default: [] })
  cImg?: Array<string>;
}
