import { ApiProperty } from '@nestjs/swagger';

export class Resident {
  _id: string;

  @ApiProperty({ example: '79999999999', description: 'Номер телефона' })
  phone: string;

  @ApiProperty({ example: 'test@test.test', description: 'Электронная почта' })
  email: string;

  @ApiProperty({
    example: 'новичок',
    description: 'Квалификация резидента',
    nullable: true,
  })
  quality: string;

  @ApiProperty({
    example: '@testNick',
    description: 'Никнейм инстаграм',
    nullable: true,
  })
  instagram: string;

  @ApiProperty({
    example: '@testNick',
    description: 'Никнейм vk',
    nullable: true,
  })
  vk: string;

  @ApiProperty({
    example: 'О себе',
    description: 'информация о себе',
    nullable: true,
  })
  bio: string;

  @ApiProperty({ example: 'Томск', description: 'Город', nullable: true })
  city: string;

  @ApiProperty({ example: '25', description: 'Возраст', nullable: true })
  age: string;

  @ApiProperty({
    example: 'от 500 руб. кв. м.',
    description: 'Стоимость услуг',
    nullable: true,
  })
  price: string;

  @ApiProperty({
    example: false,
    description: 'Готовность к удаленной работе',
    nullable: true,
  })
  readyToRemote: boolean;

  @ApiProperty({
    example: false,
    description: 'Готовность к работе прямо сейчас',
    nullable: true,
  })
  readyToWorkNow: boolean;
}
