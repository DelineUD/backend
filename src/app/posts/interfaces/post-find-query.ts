import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsEmpty, IsMongoId, IsOptional, IsString } from 'class-validator';

export class IPostsFindQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString({ each: true })
  groups?: string[];

  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @IsBooleanString()
  publishInProfile?: boolean;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsMongoId()
  lastIndex?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmpty()
  desc?: string;
}
