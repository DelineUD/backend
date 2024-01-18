import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { validateBooleanOfString } from '@shared/validators/validateBooleanOfString';
import { StatusFilterKeys } from '@app/filters/consts';
import { UserDto } from './user.dto';

export class CreateUserDto extends PartialType(UserDto) {
  @ApiProperty({ default: '' })
  readonly id: string;
  @ApiProperty({ default: 'email@gmail.ru' })
  readonly email: string;
  @ApiProperty({ default: '79992456800' })
  readonly phone: string;
  @ApiProperty({ default: '' })
  readonly password: string;

  @ApiProperty({ default: 'Максим' })
  readonly first_name: string;
  @ApiProperty({ default: 'Баранов' })
  readonly last_name: string;
  @ApiProperty({ default: '02.04.2003' })
  readonly birthday: string;

  @ApiProperty({ default: 'Frontend Developer', required: false })
  readonly qualification?: string;

  @ApiProperty({ default: 'Обо мне...', required: false })
  readonly about?: string;
  @ApiProperty({ default: StatusFilterKeys.sf001, required: false })
  readonly status?: StatusFilterKeys;

  @ApiProperty({ default: 'Россия', required: false })
  readonly country?: string;
  @ApiProperty({ default: 'Санкт-Петербург', required: false })
  readonly city?: string;
  @ApiProperty({ default: false, required: false })
  readonly hide_phone?: boolean;

  @ApiProperty({ default: 'Курс 1, Курс 2', required: false })
  readonly courses_new_app?: string;
  @ApiProperty({ default: 'Программа 1, Программа 2', required: false })
  readonly programs_new_app?: string;
  @ApiProperty({ default: 'Специализация 1, Специализация 2', required: false })
  readonly specialization_new_app?: string;
  @ApiProperty({ default: 'Узкая специализация 1, Узкая специализация 2', required: false })
  readonly narrow_spec_new_app?: string;
}
