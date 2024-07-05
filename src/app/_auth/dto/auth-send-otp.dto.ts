import { IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthSendOtpDto {
  @ApiProperty({ example: '+79992456800', description: 'Номер телефона пользователя' })
  @IsPhoneNumber('RU')
  phone: string;
}
