import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

import { UserDto } from './user.dto';

export class CreateUserDto extends PartialType(UserDto) {
  // Personal Information
  @IsEmail()
  @IsString()
  @ApiProperty({
    default: 'email@gmail.ru',
  })
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
}
