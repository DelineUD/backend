import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetPostParamsDto {
  @ApiProperty({ default: '' })
  @IsString()
  @IsNotEmpty()
  _id?: string;
}
