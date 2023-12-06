import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBooleanString, IsEmpty, IsOptional, IsString } from 'class-validator';

export class ResumeFindQueryDto {
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  country?: string;
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  city?: string;
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsArray()
  qualification?: string;
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsArray()
  narrow_specialization?: string;
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsArray()
  need_programs?: string;
  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @IsBooleanString()
  remote_work?: boolean;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmpty()
  desc?: string;
}
