import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFiltersDto {
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  countryName?: string;
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  cityName?: string;
  @ApiProperty({ default: [], required: false })
  @IsOptional()
  @IsString()
  specializationNames?: string[];
  @ApiProperty({ default: [], required: false })
  @IsOptional()
  @IsString()
  narrowSpecializationNames?: string[];
  @ApiProperty({ default: [], required: false })
  @IsOptional()
  @IsString()
  programs?: string[];
  @ApiProperty({ default: [], required: false })
  @IsOptional()
  @IsString()
  courses?: string[];
}
