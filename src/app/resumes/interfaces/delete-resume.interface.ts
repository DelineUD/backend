import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IDeleteResumeQuery {
  @ApiProperty({ default: '' })
  @IsString()
  readonly id_resume1: string;
}
