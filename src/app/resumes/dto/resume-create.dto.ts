import { IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { EUserJobExperience } from '@shared/consts/user-experience.enum';
import { EUserJobFormat } from '@shared/consts/user-format.enum';

export class ResumeCreateDto {
  @ApiProperty({ example: 'Графический дизайнер' })
  @IsString()
  name: string;
  @ApiProperty({ example: EUserJobExperience.et001 })
  @IsString()
  job_experience: string;
  @ApiProperty({ example: EUserJobFormat.ft005 })
  @IsString()
  job_format: string;
  @ApiProperty({ example: 'Дизайнер общей практики' })
  @IsOptional()
  @IsString()
  specialization: string;
  @ApiProperty({ example: 'Почта: pochta@mail.ru' })
  @IsString()
  contacts: string;
  @IsOptional()
  @IsString()
  city?: string;
  @IsOptional()
  @IsString()
  about?: string;
  @IsOptional()
  @IsString()
  project_involvement?: string;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  qualifications?: string[];
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  programs?: string[];
}
