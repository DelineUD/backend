import { ApiProperty } from '@nestjs/swagger';

export class ResidentList {
  @ApiProperty({
    example: 'string',
    description: 'id резидента',
    nullable: true,
  })
  _id: string;

  @ApiProperty({
    example: 'string',
    description: 'Имя резидента',
    nullable: true,
  })
  first_name: string;

  @ApiProperty({
    example: 'string',
    description: 'Фамилия резидента',
    nullable: true,
  })
  last_name: string;
}
