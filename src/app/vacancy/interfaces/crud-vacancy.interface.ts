import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { validateStringToBoolean } from '@helpers/validateStringToBoolean';
import { validateStringToArray } from '@helpers/validateStringToArray';

export class ICrudVacancyParams {
  @ApiProperty({ default: '', required: true })
  @IsString()
  readonly id: string;

  @ApiProperty({ default: 'vacancy_1', required: false })
  @IsOptional()
  @IsString()
  readonly id_vacancy1?: string;

  @ApiProperty({ default: 'vacancy_2', required: false })
  @IsOptional()
  @IsString()
  readonly id_vacancy2?: string;

  @ApiProperty({ default: 'Вакансия 1', required: false })
  @IsOptional()
  @IsString()
  readonly name_vacancy1?: string;

  @ApiProperty({ default: 'Вакансия 2', required: false })
  @IsOptional()
  @IsString()
  readonly name_vacancy2?: string;

  @ApiProperty({ default: 'Россия', required: false })
  @IsOptional()
  @IsString()
  readonly country_vacancy1?: string;

  @ApiProperty({ default: 'Россия', required: false })
  @IsOptional()
  @IsString()
  readonly country_vacancy2?: string;

  @ApiProperty({ default: 'Санкт-Петербург', required: false })
  @IsOptional()
  @IsString()
  readonly city_vacancy1?: string;

  @ApiProperty({ default: 'Санкт-Петербург', required: false })
  @IsOptional()
  @IsString()
  readonly city_vacancy2?: string;

  @ApiProperty({ default: 'Информация о вакансии...', required: false })
  @IsOptional()
  @IsString()
  readonly about_vacancy1?: string;

  @ApiProperty({ default: 'Информация о вакансии...', required: false })
  @IsOptional()
  @IsString()
  readonly about_vacancy2?: string;

  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @Transform(validateStringToBoolean)
  remote_work_vacancy1?: boolean;

  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @Transform(validateStringToBoolean)
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
  @Transform(validateStringToArray)
  narrow_spec_vacancy1?: string;

  @ApiProperty({ default: 'Специализация 1, Специализация 2', required: false })
  @IsOptional()
  @Transform(validateStringToArray)
  narrow_spec_vacancy2?: string;

  @ApiProperty({ default: 'Программа 1, Программа 2', required: false })
  @IsOptional()
  @Transform(validateStringToArray)
  need_programs_vacancy1?: string;

  @ApiProperty({ default: 'Программа 1, Программа 2', required: false })
  @IsOptional()
  @Transform(validateStringToArray)
  need_programs_vacancy2?: string;

  @ApiProperty({ default: 5000, required: false })
  @IsOptional()
  @IsNumberString()
  service_cost_vacancy1?: number;

  @ApiProperty({ default: 5000, required: false })
  @IsOptional()
  @IsNumberString()
  service_cost_vacancy2?: number;
}
