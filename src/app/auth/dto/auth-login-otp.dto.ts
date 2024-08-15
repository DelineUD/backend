import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginOtpDto {
  @ApiProperty({ example: '+79992456800', description: 'Номер телефона пользователя' })
  @IsPhoneNumber('RU')
  phone: string;
  @ApiProperty({ example: '1221', description: 'Код из СМС' })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
