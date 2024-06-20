import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class AuthRegisterOtpDto {
  @IsPhoneNumber('RU')
  phone: string;
  @IsString()
  @IsNotEmpty()
  otp: string;
}
