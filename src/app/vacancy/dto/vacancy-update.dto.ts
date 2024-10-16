import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { EUserJobExperience } from '@/app/shared/consts/user-experience.enum';
import { EUserJobFormat } from '@/app/shared/consts/user-format.enum';
import { EUserProjectInvolvement } from '@/app/shared/consts/user-involvement.enum';

export class VacancyUpdateDto {
  @IsString()
  name?: string;
  @IsString()
  @ApiPropertyOptional({
    enum: EUserJobExperience,
    description: 'Опыт работы',
    default: EUserJobExperience.et004,
    required: true,
  })
  @IsEnum(EUserJobExperience, { each: true })
  job_experience?: EUserJobExperience;
  @ApiPropertyOptional({
    enum: EUserJobFormat,
    description: 'Формат работы',
    default: EUserJobFormat.ft001,
    required: true,
  })
  @IsEnum(EUserJobFormat, { each: true })
  job_format?: EUserJobFormat;
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
  @IsEnum(EUserProjectInvolvement, { each: true })
  project_involvement?: EUserProjectInvolvement;
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
