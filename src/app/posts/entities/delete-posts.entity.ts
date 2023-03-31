import { ApiProperty } from '@nestjs/swagger';

export class DeletePostEntity {
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
}
