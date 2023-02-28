import { IsNotEmpty } from 'class-validator';

export class LoginSmsDto {
    @IsNotEmpty()
    readonly vpass: number;

    @IsNotEmpty()
    readonly phone: number;

    @IsNotEmpty()
    readonly password: string;
  }
  