import { IsNotEmpty, IsNumber } from 'class-validator';

export class LoginSmsDto {
  @IsNotEmpty()
  @IsNumber()
  readonly authorization: number;
}
