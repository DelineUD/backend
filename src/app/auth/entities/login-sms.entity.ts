import { ApiProperty } from '@nestjs/swagger';
import HttpStatusCode from 'http-status-typed';

export class LoginSms {
  @ApiProperty({
    example: 79999999999,
    description: 'номер телефона с регионом ru',
  })
  phone: number;

  @ApiProperty({
    example: HttpStatusCode.OK,
    description: 'запрос выполнен успешно',
  })
  status: HttpStatusCode;
}
