import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { validateBooleanOfString } from '@shared/validators/validateBooleanOfString';
import { validateArrayOfString } from '@shared/validators/validateArrayOfString';

export class ICrudResumeParams {
  @ApiProperty({ default: '', required: false })
  @IsString()
  readonly id: string;

  @ApiProperty({ default: 'resume_1', required: false })
  @IsOptional()
  @IsString()
  readonly id_resume1?: string;

  @ApiProperty({ default: 'resume_2', required: false })
  @IsOptional()
  @IsString()
  readonly id_resume2?: string;

  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @Transform(validateBooleanOfString)
  readonly remote_work_resume1?: boolean;

  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @Transform(validateBooleanOfString)
  readonly remote_work_resume2?: boolean;

  @ApiProperty({ default: 'Квалификация', required: false })
  @IsOptional()
  @IsString()
  readonly qualification_resume1?: string;

  @ApiProperty({ default: 'Квалификация', required: false })
  @IsOptional()
  @IsString()
  readonly qualification_resume2?: string;

  @ApiProperty({ default: 'Специализация 1, Специализация 2', required: false })
  @IsOptional()
  @Transform(validateArrayOfString)
  readonly spec_resume1?: string;

  @ApiProperty({ default: 'Специализация 1, Специализация 2', required: false })
  @IsOptional()
  @Transform(validateArrayOfString)
  readonly spec_resume2?: string;

  @ApiProperty({ default: 'Узкая специализация 1, Узкая специализация 2', required: false })
  @IsOptional()
  @Transform(validateArrayOfString)
  readonly narrow_spec_resume1?: string;

  @ApiProperty({ default: 'Узкая специализация 1, Узкая специализация 2', required: false })
  @IsOptional()
  @Transform(validateArrayOfString)
  readonly narrow_spec_resume2?: string;

  @ApiProperty({ default: 5000, required: false })
  @IsOptional()
  @IsNumberString()
  readonly service_cost_resume1?: number;

  @ApiProperty({ default: 5000, required: false })
  @IsOptional()
  @IsNumberString()
  readonly service_cost_resume2?: number;

  @ApiProperty({ default: 'https://portfolio1.ru', required: false })
  @IsOptional()
  @IsString()
  readonly portfolio_resume1?: string;

  @ApiProperty({ default: 'https://portfolio2.ru', required: false })
  @IsOptional()
  @IsString()
  readonly portfolio_resume2?: string;
}
