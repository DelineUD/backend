import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsNumberString, IsOptional, IsString } from 'class-validator';

export class ICrudVacancyParams {
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

  // Resume information
  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @IsBooleanString()
  remote_work_vacancy1?: boolean;

  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @IsBooleanString()
  remote_work_vacancy2?: boolean;

  @ApiProperty({ default: 'Квалификация 1, Кваливфикация 2', required: false })
  @IsOptional()
  @IsString()
  qualification_vacancy1?: string;

  @ApiProperty({ default: 'Квалификация 1, Кваливфикация 2', required: false })
  @IsOptional()
  @IsString()
  qualification_vacancy2?: string;

  @ApiProperty({ default: 'Специализация 1, Специализация 2', required: false })
  @IsOptional()
  @IsString()
  narrow_spec_vacancy1?: string;

  @ApiProperty({ default: 'Специализация 1, Специализация 2', required: false })
  @IsOptional()
  @IsString()
  narrow_spec_vacancy2?: string;

  @ApiProperty({ default: ' Программа 1, Программа 2', required: false })
  @IsOptional()
  @IsString()
  need_programs_vacancy1?: string;

  @ApiProperty({ default: 'Программа 1, Программа 2', required: false })
  @IsOptional()
  @IsString()
  need_programs_vacancy2?: string;

  @ApiProperty({ default: 5000, required: false })
  @IsOptional()
  @IsNumberString()
  service_cost_vacancy1?: string;

  @ApiProperty({ default: 5000, required: false })
  @IsOptional()
  @IsNumberString()
  service_cost_vacancy2?: string;
}
