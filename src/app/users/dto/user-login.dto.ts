import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  readonly phone: number;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly vpass: number;

  readonly refreshToken: string;

  readonly refreshtoken: string;
}