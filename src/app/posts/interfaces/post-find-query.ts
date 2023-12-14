import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsMongoId, IsOptional, IsString } from 'class-validator';

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
  @IsMongoId()
  lastIndex?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmpty()
  desc?: string;
}
