import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeletePostDto {
  @ApiProperty({ default: '' })
  @IsString()
  @IsNotEmpty()
  _id: string;
}
