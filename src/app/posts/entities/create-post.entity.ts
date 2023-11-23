import { ApiProperty } from '@nestjs/swagger';

export class CreatePostEntity {
  @ApiProperty({
    type: String,
    description: 'id автора',
  })
  authorId: string;

  @ApiProperty({
    type: String,
    description: 'Текст комментария',
  })
  pText: string;

  @ApiProperty({
    type: String,
    description: 'Картинка',
  })
  pImg: string;

  @ApiProperty({
    type: String,
    description: 'Группа',
  })
  group: string;
}
