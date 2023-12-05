import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

import { PostDto } from '@app/posts/dto/post.dto';

export class DeletePostDto extends PartialType(PostDto) {
  @ApiProperty({ default: '' })
  @IsMongoId()
  @IsNotEmpty()
  postId: string;
}
