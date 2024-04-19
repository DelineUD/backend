import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResidentsBlockDto {
  @ApiProperty({ default: '' })
  @IsMongoId()
  residentId: string;
}
