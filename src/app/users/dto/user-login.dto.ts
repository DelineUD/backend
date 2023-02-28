import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  readonly phone: number;

  @IsNotEmpty()
  readonly password: string;
}
