import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { validateStringOfObjectId } from '@shared/validators/validateStringOfObjectId';

export class ResumeFindQueryDto {
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @Transform(validateStringOfObjectId)
  specialization?: string;

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmpty()
  desc?: string | undefined;
}
