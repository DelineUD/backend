import { ApiProperty } from '@nestjs/swagger';

export class CommentListEntity {
  @ApiProperty({
    example: 'боди текст',
    description: 'боди текст',
  })
  cText: string;

  @ApiProperty({
    example: 'img[]',
    description: 'img[]',
  })
  cImg: Array<string>;

  @ApiProperty({
    example: 'ID коммента',
    description: 'ID коммента',
  })
  _id: string;

  @ApiProperty({
    example: 'ID поста родителя',
    description: 'ID поста родителя',
  })
  postID: string;

  @ApiProperty({
    example: 'ID автора',
    description: 'ID автора',
  })
  authorId: string;

  @ApiProperty({
    example: 'Лайки массив[]',
    description: 'Лайки массив',
  })
  likes: Array<string>;

  @ApiProperty({
    example: 0,
    description: 'кол-во лайков',
  })
  countLikes: number;

  @ApiProperty({
    example: false,
    description: 'Лайкнут мной ?',
  })
  isLiked: boolean;
}
