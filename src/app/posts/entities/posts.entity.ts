import { ApiProperty } from '@nestjs/swagger';

export class PostEntity {
  @ApiProperty({
    example: false,
    description: 'id',
  })
  _id: string;

  @ApiProperty({
    example: false,
    description: 'id автора',
  })
  authorId: string;

  @ApiProperty({
    example: false,
    description: 'боди текст',
  })
  pText: string;

  @ApiProperty({
    example: false,
    description: 'прилеплен',
  })
  stick: string;

  @ApiProperty({
    example: false,
    description: 'картинки',
  })
  pImg: string;

  @ApiProperty({
    example: false,
    description: 'лайки',
  })
  likes: number;

  @ApiProperty({
    example: false,
    description: 'просмотры',
  })
  views: number;

  @ApiProperty({
    example: false,
    description: 'группа',
  })
  group: string;

  @ApiProperty({
    example: false,
    description: 'дата создания',
  })
  createdAt: string;

  @ApiProperty({
    example: false,
    description: 'дата редактирования',
  })
  updatedAt: string;
}
