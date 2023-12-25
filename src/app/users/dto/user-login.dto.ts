import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ default: '+79819839117' })
  @IsPhoneNumber('RU')
  readonly phone: string;

  @IsNotEmpty()
  @ApiProperty({ default: 'admin' })
  readonly password: string;
}
