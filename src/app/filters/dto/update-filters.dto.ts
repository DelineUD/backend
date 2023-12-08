import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFiltersDto {
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  country?: string;
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  city?: string;
  @ApiProperty({ default: [], required: false })
  @IsOptional()
  @IsString()
  specializations?: string[];
  @ApiProperty({ default: [], required: false })
  @IsOptional()
  @IsString()
  narrow_specializations?: string[];
  @ApiProperty({ default: [], required: false })
  @IsOptional()
  @IsString()
  programs?: string[];
  @ApiProperty({ default: [], required: false })
  @IsOptional()
  @IsString()
  courses?: string[];
}
