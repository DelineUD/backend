import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { validateArrayOfString } from '@shared/validators/validateArrayOfString';

export class ICrudVacancyParams {
  @ApiProperty({ default: '' })
  @IsString()
  readonly id: string;

  @ApiProperty({ default: 'vacancy_1' })
  @IsString()
  readonly id_vacancy1: string;

  @ApiProperty({ default: 'Вакансия 1' })
  @IsString()
  readonly name_vacancy1: string;

  @ApiProperty({ default: 'Россия' })
  @IsString()
  readonly country_vacancy1: string;

  @ApiProperty({ default: 'Санкт-Петербург' })
  @IsString()
  readonly city_vacancy1: string;

  @ApiProperty({ default: 'Информация о вакансии...' })
  @IsString()
  readonly about_vacancy1: string;

  @ApiProperty({ default: 'Дополнительная информация...' })
  @IsString()
  readonly other_vacancy1: string;

  @ApiProperty({ default: false })
  @IsString()
  readonly format_vacancy1: boolean;

  @ApiProperty({ default: 'Квалификация', required: false })
  @IsOptional()
  @IsString()
  readonly qualification_vacancy1?: string;

  @ApiProperty({ default: 'Специализация 1, Специализация 2', required: false })
  @IsOptional()
  @Transform(validateArrayOfString)
  readonly narrow_spec_vacancy1?: string[];

  @ApiProperty({ default: 'Программа 1, Программа 2', required: false })
  @IsOptional()
  @Transform(validateArrayOfString)
  readonly need_programs_vacancy1?: string[];

  @ApiProperty({ default: 5000, required: false })
  @IsOptional()
  @IsNumberString()
  readonly service_cost_vacancy1?: number;
}
