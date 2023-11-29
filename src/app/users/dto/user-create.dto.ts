import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
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
  @ApiProperty({ default: '02.04.2023' })
  readonly birthday: Date;

  @ApiProperty({ default: 'Курс 1, Курс 2', required: false })
  readonly courses_newapp?: string;
  @ApiProperty({ default: 'Программа 1, Программа 2', required: false })
  readonly programs_newapp?: string;
  @ApiProperty({ default: 'Специализация 1, Специализация 2', required: false })
  readonly specialization_newapp?: string;
  @ApiProperty({ default: 'Узкая специализация 1, Узкая специализация 2', required: false })
  readonly narrow_spec_newapp?: string;
}
