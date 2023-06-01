import { ApiProperty } from '@nestjs/swagger';

export class DeleteCommentPostEntity {
  @ApiProperty({
    example: 'id коммента',
    description: 'id коммента',
  })
  _id?: string;
}
