import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ default: '+79992456800' })
  @IsPhoneNumber('RU', { message: 'Невалидный номер телефона!' })
  readonly phone: string;

  @IsNotEmpty()
  @ApiProperty({ default: '123' })
  readonly password: string;
}
