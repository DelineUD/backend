import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class AuthLoginDto {
  @IsPhoneNumber('RU')
  phone: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
