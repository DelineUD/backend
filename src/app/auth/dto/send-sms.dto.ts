import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendSmsDto {
  @IsNotEmpty()
  @IsPhoneNumber('RU')
  @ApiProperty({ default: 79992456800 })
  readonly phone: number;
}
