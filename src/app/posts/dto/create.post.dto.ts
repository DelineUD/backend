import { ApiProperty, PartialType } from '@nestjs/swagger';

import { PostDto } from '@app/posts/dto/post.dto';

export class CreatePostDto extends PartialType(PostDto) {
  @ApiProperty({ default: 'Новый пост' })
  pText?: string;
  @ApiProperty({ default: 'Новое' })
  group?: string;
  @ApiProperty({ default: [] })
  pImg?: Array<string>;
}
