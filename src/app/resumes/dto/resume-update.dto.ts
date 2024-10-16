import { IsOptional, IsString, IsArray, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { EUserJobExperience } from '@shared/consts/user-experience.enum';
import { EUserJobFormat } from '@shared/consts/user-format.enum';
import { EUserProjectInvolvement } from '@/app/shared/consts/user-involvement.enum';

export class ResumeUpdateDto {
  @ApiProperty({ example: 'Графический дизайнер' })
  @IsOptional()
  @IsString()
  name?: string;
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
  @ApiProperty({ example: 'Дизайнер общей практики' })
  @IsOptional()
  @IsString()
  specialization?: string;
  @ApiProperty({ example: 'Почта: pochta@mail.ru' })
  @IsString()
  contacts?: string;
  @IsOptional()
  @IsString()
  city?: string;
  @IsOptional()
  @IsString()
  about?: string;
  @IsOptional()
  @IsEnum(EUserProjectInvolvement, { each: true })
  project_involvement?: EUserProjectInvolvement;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  qualifications?: string[];
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  programs?: string[];
}
