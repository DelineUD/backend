import { IsBooleanString, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

import { UserDto } from './user.dto';
import { StatusFilterKeys } from '@app/filters/consts';

export class CreateUserDto extends PartialType(UserDto) {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: '' })
  readonly id: string;

  // Personal Information
  @IsEmail()
  @IsString()
  @ApiProperty({ default: 'email@gmail.ru' })
  readonly email: string;
  @IsPhoneNumber('RU')
  @ApiProperty({ default: 79992456800 })
  readonly phone: number;
  @IsString()
  @ApiProperty({ default: 'admin' })
  readonly password: string;
  @IsString()
  @ApiProperty({ default: 'Максим' })
  readonly first_name: string;
  @IsString()
  @ApiProperty({ default: 'Баранов' })
  readonly last_name: string;
  @ApiProperty({ default: new Date('02.04.2003') })
  readonly birthday: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'Frontend Developer', required: false })
  readonly qualification?: string;
  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'Обо мне...', required: false })
  readonly about?: string;
  @IsString()
  @ApiProperty({ default: StatusFilterKeys.sf001, required: false })
  readonly status?: StatusFilterKeys;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'Россия', required: false })
  readonly country?: string;
  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'Санкт-Петербург', required: false })
  readonly city?: string;
  @IsOptional()
  @IsBooleanString()
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
