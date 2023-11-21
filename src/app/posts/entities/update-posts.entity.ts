import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostEntity {
  @ApiProperty({
    example: 'id',
    description: 'id',
  })
  _id: string;

  @ApiProperty({
    example: 'id автора',
    description: 'id автора',
  })
  authorId: string;

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
