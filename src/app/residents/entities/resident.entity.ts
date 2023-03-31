import { ApiProperty } from '@nestjs/swagger';

export class Resident {
  @ApiProperty({
    example: 'id',
    description: 'id резидента',
    nullable: true,
  })
  _id: string;

  @ApiProperty({
    example: 'новичок',
    description: 'Квалификация резидента',
    nullable: true,
  })
  qualification: string;

  @ApiProperty({
    example: 'Имя',
    description: 'Имя резидента',
    nullable: true,
  })
  first_name: string;

  @ApiProperty({
    example: 'Фамилия',
    description: 'Фамилия резидента',
    nullable: true,
  })
  last_name: string;
}
