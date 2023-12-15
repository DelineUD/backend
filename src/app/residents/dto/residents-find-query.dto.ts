import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { validateObjectId } from '@helpers/validateObjectId';

export class ResidentsFindQueryDto {
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsMongoId()
  country?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsMongoId()
  city?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsMongoId()
  status?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @Transform(validateObjectId)
  specializations?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @Transform(validateObjectId)
  narrow_specializations?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @Transform(validateObjectId)
  programs?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @Transform(validateObjectId)
  courses?: string;
}
