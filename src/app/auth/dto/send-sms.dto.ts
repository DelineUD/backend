import { IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendSmsDto {
  @ApiProperty({ default: '+79992456800' })
  @IsPhoneNumber('RU', { message: 'Невалидный номер телефона!' })
  readonly phone: string;
}
