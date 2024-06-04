import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class AuthLoginOtpDto {
  @IsPhoneNumber('RU')
  phone: string;
  @IsString()
  @IsNotEmpty()
  otp: string;
}
