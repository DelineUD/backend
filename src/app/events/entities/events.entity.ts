import { ApiProperty } from '@nestjs/swagger';

export class EventsEntity {
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
    example: 'текст заголовка',
    description: 'текст заголовка',
  })
  hText: string;

  @ApiProperty({
    example: 'картинка',
    description: 'картинка',
  })
  hImg: string;

  @ApiProperty({
    example: 'дата начала',
    description: 'дата начала',
  })
  startDate: string;

  @ApiProperty({
    example: 'дата окончания',
    description: 'дата окончания',
  })
  stopDate: string;

  @ApiProperty({
    example: 'Адрес',
    description: 'Адрес',
  })
  addr: string;

  @ApiProperty({
    example: 'Категория',
    description: 'Категория',
  })
  category: string;

  @ApiProperty({
    example: 'доступ',
    description: 'доступ',
  })
  access: string;

  @ApiProperty({
    example: 'Формат',
    description: 'Формат',
  })
  format: string;

  @ApiProperty({
    example: 'Боди текст',
    description: 'Боди текст',
  })
  bodyText: string;
}
