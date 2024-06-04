import { IsPhoneNumber } from 'class-validator';

export class AuthSendOtpDto {
  @IsPhoneNumber('RU')
  phone: string;
}
