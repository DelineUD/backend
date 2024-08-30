import { IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { validatePhoneNumber } from '@shared/validators/validatePhoneNumber';

export class AuthSendOtpDto {
  @ApiProperty({ example: '+79992456800', description: 'Номер телефона пользователя' })
  @IsPhoneNumber('RU')
  @Transform(validatePhoneNumber)
  phone: string;
}
