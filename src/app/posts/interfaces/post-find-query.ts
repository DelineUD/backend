import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsOptional, IsString } from 'class-validator';

export class IPostsFindQuery {
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  group?: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  lastIndex?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmpty()
  desc?: string;
}
