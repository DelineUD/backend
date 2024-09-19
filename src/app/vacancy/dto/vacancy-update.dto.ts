import { IsOptional, IsString, IsArray, ArrayMaxSize, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class VacancyUpdateDto {
  @IsString()
  name?: string;
  @IsString()
  job_experience?: string;
  @IsString()
  job_format?: string;
  @ApiProperty({ example: 'Почта: pochta@mail.ru' })
  @IsString()
  contacts?: string;
  @IsOptional()
  @IsString()
  about?: string;
  @IsOptional()
  @IsString()
  city?: string;
  @IsOptional()
  @ArrayMaxSize(2)
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : [Number(value)]))
  @IsNumber({}, { each: true })
  payment?: number[];
  @IsOptional()
  @IsString()
  project_involvement?: string;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specializations?: string[];
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  qualifications?: string[];
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  programs?: string[];
}
