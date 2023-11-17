import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @IsPhoneNumber()
  @ApiProperty({
    default: '+79992456800',
  })
  readonly phone: number;

  @IsNotEmpty()
  @ApiProperty({ default: 'admin' })
  readonly password: string;
}
