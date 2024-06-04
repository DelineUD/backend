import { IsPhoneNumber } from 'class-validator';

export class AuthProfileCheckDto {
  @IsPhoneNumber('RU')
  phone: string;
}
