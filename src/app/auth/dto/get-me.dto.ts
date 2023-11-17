import { IsString } from 'class-validator';

export class GetMeDto {
  @IsString()
  readonly authorization: string;
}
