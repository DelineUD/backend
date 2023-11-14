import { IsNotEmpty, IsNumber, IsPhoneNumber } from 'class-validator';
import { UserDto } from '../../users/dto/user.dto';

export class LoginSmsDto extends UserDto {
  @IsNotEmpty()
  @IsPhoneNumber('RU')
  readonly phone: number;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  @IsNumber()
  readonly vPass: number;
}
