import { ApiProperty } from '@nestjs/swagger';

export class CreatePostEntity {
  @ApiProperty({
    example: 'id автора',
    description: 'id автора',
  })
  author: string;

  @ApiProperty({
    example: 'боди текст',
    description: 'боди текст',
  })
  pText: string;

  @ApiProperty({
    example: 'картинки',
    description: 'картинки',
  })
  pImg: string;

  @ApiProperty({
    example: 'группа',
    description: 'группа',
  })
  group: string;
}
