import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { validateBooleanOfString } from '@shared/validators/validateBooleanOfString';
import { validateArrayOfString } from '@shared/validators/validateArrayOfString';

export class ICrudVacancyParams {
  @ApiProperty({ default: '' })
  @IsString()
  readonly id: string;

  @ApiProperty({ default: 'vacancy_1' })
  @IsString()
  readonly id_vacancy1: string;

  @ApiProperty({ default: 'vacancy_2' })
  @IsString()
  readonly id_vacancy2?: string;

  @ApiProperty({ default: 'Вакансия 1' })
  @IsString()
  readonly name_vacancy1?: string;

  @ApiProperty({ default: 'Вакансия 2' })
  @IsString()
  readonly name_vacancy2?: string;

  @ApiProperty({ default: 'Россия' })
  @IsString()
  readonly country_vacancy1?: string;

  @ApiProperty({ default: 'Россия' })
  @IsString()
  readonly country_vacancy2?: string;

  @ApiProperty({ default: 'Санкт-Петербург' })
  @IsString()
  readonly city_vacancy1?: string;

  @ApiProperty({ default: 'Санкт-Петербург' })
  @IsString()
  readonly city_vacancy2?: string;

  @ApiProperty({ default: 'Информация о вакансии...' })
  @IsString()
  readonly about_vacancy1?: string;

  @ApiProperty({ default: 'Информация о вакансии...' })
  @IsString()
  readonly about_vacancy2?: string;

  @ApiProperty({ default: false })
  @Transform(validateBooleanOfString)
  remote_work_vacancy1?: boolean;

  @ApiProperty({ default: false })
  @Transform(validateBooleanOfString)
  remote_work_vacancy2?: boolean;

  @ApiProperty({ default: 'Квалификация', required: false })
  @IsOptional()
  @IsString()
  qualification_vacancy1?: string;

  @ApiProperty({ default: 'Квалификация', required: false })
  @IsOptional()
  @IsString()
  qualification_vacancy2?: string;

  @ApiProperty({ default: 'Специализация 1, Специализация 2', required: false })
  @IsOptional()
  @Transform(validateArrayOfString)
  narrow_spec_vacancy1?: string[];

  @ApiProperty({ default: 'Специализация 1, Специализация 2', required: false })
  @IsOptional()
  @Transform(validateArrayOfString)
  narrow_spec_vacancy2?: string[];

  @ApiProperty({ default: 'Программа 1, Программа 2', required: false })
  @IsOptional()
  @Transform(validateArrayOfString)
  need_programs_vacancy1?: string[];

  @ApiProperty({ default: 'Программа 1, Программа 2', required: false })
  @IsOptional()
  @Transform(validateArrayOfString)
  need_programs_vacancy2?: string[];

  @ApiProperty({ default: 5000, required: false })
  @IsOptional()
  @IsNumberString()
  service_cost_vacancy1?: number;

  @ApiProperty({ default: 5000, required: false })
  @IsOptional()
  @IsNumberString()
  service_cost_vacancy2?: number;
}
