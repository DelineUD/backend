import { ApiProperty } from '@nestjs/swagger';

export class PostEntity {
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
    example: 0,
    description: 'лайки',
  })
  likes: number;

  @ApiProperty({
    example: 0,
    description: 'просмотры',
  })
  views: number;

  @ApiProperty({
    example: 'группа',
    description: 'группа',
  })
  group: string;

  @ApiProperty({
    example: 'дата создания',
    description: 'дата создания',
  })
  createdAt: string;

  @ApiProperty({
    example: 'дата редактирования',
    description: 'дата редактирования',
  })
  updatedAt: string;
}
