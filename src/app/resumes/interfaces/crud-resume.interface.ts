import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

import { validateArrayOfString } from '@shared/validators/validateArrayOfString';

export class ICrudResumeParams {
  @ApiProperty({ default: '' })
  @IsString()
  readonly id: string;

  @ApiProperty({ default: 'resume_1' })
  @IsString()
  readonly id_resume1: string;

  @ApiProperty({ default: 'Россия' })
  @IsString()
  readonly country_resume1: string;

  @ApiProperty({ default: 'Санкт-Петербург' })
  @IsString()
  readonly city_resume1: string;

  @ApiProperty({ default: 'Удаленная работа' })
  @IsString()
  readonly format_resume1: boolean;

  @ApiProperty({ default: 'Квалификация' })
  @IsString()
  readonly qualification_resume1: string;

  @ApiProperty({ default: 'Обо мне...' })
  @IsString()
  @IsOptional()
  readonly about_resume1: string;

  @ApiProperty({ default: 'Дополнительная информация...' })
  @IsString()
  @IsOptional()
  readonly other_resume1: string;

  @ApiProperty({ default: 'Специализация 1, Специализация 2', required: false })
  @IsOptional()
  @Transform(validateArrayOfString)
  readonly spec_resume1?: string;

  @ApiProperty({ default: 'Узкая специализация 1, Узкая специализация 2', required: false })
  @IsOptional()
  @Transform(validateArrayOfString)
  readonly narrow_spec_resume1?: string;

  @ApiProperty({ default: 5000, required: false })
  @IsOptional()
  @IsNumberString()
  readonly service_cost_resume1?: number;

  @ApiProperty({ default: 'https://portfolio.ru', required: false })
  @IsOptional()
  @IsString()
  readonly portfolio_resume1?: string;
}
