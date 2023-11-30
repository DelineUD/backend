import { IsBooleanString, IsNumberString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ICrudResumeParams {
  @ApiProperty({ default: 'resume_1', required: false })
  @IsOptional()
  @IsString()
  readonly id_resume1?: string;

  @ApiProperty({ default: 'resume_2', required: false })
  @IsOptional()
  @IsString()
  readonly id_resume2?: string;

  // Resume information
  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @IsBooleanString()
  remote_work_resume1?: boolean;

  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @IsBooleanString()
  remote_work_resume2?: boolean;

  @ApiProperty({ default: 'Квалификация 1, Кваливфикация 2', required: false })
  @IsOptional()
  @IsString()
  qualification_resume1?: string;

  @ApiProperty({ default: 'Квалификация 1, Кваливфикация 2', required: false })
  @IsOptional()
  @IsString()
  qualification_resume2?: string;

  @ApiProperty({ default: 'Специализация 1, Специализация 2', required: false })
  @IsOptional()
  @IsString()
  narrow_spec_resume1?: string;
  @IsOptional() @IsString() narrow_spec_resume2?: string;

  @ApiProperty({ default: 5000, required: false })
  @IsOptional()
  @IsNumberString()
  service_cost_resume1?: string;

  @ApiProperty({ default: 5000, required: false })
  @IsOptional()
  @IsNumberString()
  service_cost_resume2?: string;

  @ApiProperty({ default: 'https://portfolio1.ru', required: false })
  @IsOptional()
  @IsString()
  portfolio_resume1?: string;

  @ApiProperty({ default: 'https://portfolio2.ru', required: false })
  @IsOptional()
  @IsString()
  portfolio_resume2?: string;
}
