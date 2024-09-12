import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { validateStringOfObjectId } from '@shared/validators/validateStringOfObjectId';

export class ProfilesFindQueryDto {
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @Transform(validateStringOfObjectId)
  city?: string;

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
  job_format?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @Transform(validateStringOfObjectId)
  job_experience?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @Transform(validateStringOfObjectId)
  project_involvement?: string;
}
