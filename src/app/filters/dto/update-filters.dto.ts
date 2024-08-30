import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFiltersDto {
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  city?: string;
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  specialization?: string;
  @ApiProperty({ default: [], required: false })
  @IsOptional()
  @IsString()
  programs?: string[];
}
