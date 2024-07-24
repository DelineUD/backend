import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
  @ApiProperty({ example: '+79992456800', description: 'Номер телефона пользователя' })
  @IsPhoneNumber('RU')
  phone: string;
  @ApiProperty({ example: 'root', description: 'Пароль пользователя' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
