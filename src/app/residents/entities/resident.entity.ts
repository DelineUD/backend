import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class PersonalInformationResident {
  @ApiProperty({
    type: Date,
    description: 'Дата рождения',
    nullable: true,
  })
  birthday: string;
  @ApiProperty({
    type: String,
    description: 'Пол',
    nullable: true,
  })
  gender: string;
  @ApiProperty({
    type: String,
    description: 'Страна',
    nullable: true,
  })
  city_ru: string;
  @ApiProperty({
    type: String,
    description: 'Город',
    nullable: true,
  })
  citynru: string;
}

export class DescFieldResident {
  @ApiProperty({
    type: String,
    description: 'Название поля',
  })
  field: string;

  @ApiProperty({
    description: 'Элементы в поле',
    type: [String],
  })
  items: string[];
}

export class Resident {
  @ApiProperty({
    type: Types.ObjectId,
    description: 'Id',
    nullable: true,
  })
  _id: string;

  @ApiProperty({
    type: String,
    description: 'Имя резидента',
    nullable: true,
  })
  first_name: string;

  @ApiProperty({
    type: String,
    description: 'Фамилия резидента',
    nullable: true,
  })
  last_name: string;

  @ApiProperty({
    type: String,
    description: 'Статус резидента',
    nullable: true,
  })
  status: string;

  @ApiProperty({
    type: String,
    description: 'Аватар резидента',
    nullable: true,
  })
  avatar: string;

  @ApiProperty({
    type: String,
    description: 'Обо мне для резидента',
    nullable: true,
  })
  about: string;

  @ApiProperty({
    type: PersonalInformationResident,
    description: 'Персональная ифнормация',
    nullable: true,
  })
  personal_information: PersonalInformationResident;

  @ApiProperty({
    type: [DescFieldResident],
    description: 'Подробная информация',
    nullable: true,
  })
  description_fields: DescFieldResident[];
}
