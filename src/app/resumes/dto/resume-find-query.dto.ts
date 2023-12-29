import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsEmpty, IsMongoId, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

import { validateStringOfObjectId } from '@shared/validators/validateStringOfObjectId';

export class ResumeFindQueryDto {
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @Transform(validateStringOfObjectId)
  specializations?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @Transform(validateStringOfObjectId)
  narrow_specializations?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @Transform(validateStringOfObjectId)
  programs?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @Transform(validateStringOfObjectId)
  courses?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsMongoId()
  country?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsMongoId()
  city?: string;

  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @IsBooleanString()
  remote_work?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmpty()
  desc?: string | undefined;
}
