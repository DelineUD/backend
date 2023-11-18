import { IsNotEmpty, IsString } from 'class-validator';

export class LoginSmsDto {
  @IsNotEmpty()
  @IsString()
  readonly ['user-login-data']: string;
}
