import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentPostEntity {
  @ApiProperty({
    example: 'боди текст',
    description: 'боди текст',
  })
  cText: string;

  @ApiProperty({
    example: 'картинки',
    description: 'картинки',
  })
  cImg?: Array<string>;
}
