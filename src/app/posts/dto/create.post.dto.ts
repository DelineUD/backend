import { ApiProperty, PartialType } from '@nestjs/swagger';

import { PostDto } from '@app/posts/dto/post.dto';
import { GroupFilterKeys } from '@app/filters/consts';

export class CreatePostDto extends PartialType(PostDto) {
  @ApiProperty({ default: 'Новый пост' })
  pText: string;
  @ApiProperty({ default: GroupFilterKeys.pf001 })
  group: GroupFilterKeys;
  @ApiProperty({ default: false })
  publishInProfile: boolean;
  @ApiProperty({ default: [] })
  pImg?: Array<string>;
}
