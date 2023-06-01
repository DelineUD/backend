import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentEntity {
  @ApiProperty({
    example: 'боди текст',
    description: 'боди текст',
  })
  cText: string;

  @ApiProperty({
    example: 'боди текст',
    description: 'боди текст',
  })
  cImg: string;
}
