import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

import { validateStringOfObjectId } from '@shared/validators/validateStringOfObjectId';

export class VacancyFindQueryDto {
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @Transform(validateStringOfObjectId)
  specializations?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @Transform(validateStringOfObjectId)
  programs?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @Transform(validateStringOfObjectId)
  qualifications?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @Transform(validateStringOfObjectId)
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(validateStringOfObjectId)
  project_involvement?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(validateStringOfObjectId)
  job_format?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(validateStringOfObjectId)
  job_experience?: string;

  @ApiProperty({
    required: false,
    description: 'Диапазон значений [min, max]',
    example: ['0', '1000000'],
    isArray: true,
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : [Number(value)]))
  @IsArray()
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @Max(1000000, { each: true })
  payment?: number[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmpty()
  desc?: string | undefined;
}
