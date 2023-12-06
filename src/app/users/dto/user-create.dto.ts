import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

import { UserDto } from './user.dto';

export class CreateUserDto extends PartialType(UserDto) {
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
  @ApiProperty({ default: 'Россия', required: false })
  readonly country?: string;
  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'Санкт-Петербург', required: false })
  readonly city?: string;

  @ApiProperty({ default: 'Курс 1, Курс 2', required: false })
  readonly courses_new_app?: string;
  @ApiProperty({ default: 'Программа 1, Программа 2', required: false })
  readonly programs_new_app?: string;
  @ApiProperty({ default: 'Специализация 1, Специализация 2', required: false })
  readonly specialization_new_app?: string;
  @ApiProperty({ default: 'Узкая специализация 1, Узкая специализация 2', required: false })
  readonly narrow_spec_new_app?: string;
}
