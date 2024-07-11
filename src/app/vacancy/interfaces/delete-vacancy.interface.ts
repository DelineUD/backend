import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IDeleteVacancyQuery {
  @ApiProperty({ default: '' })
  @IsString()
  readonly id_vacancy1: string;
}
