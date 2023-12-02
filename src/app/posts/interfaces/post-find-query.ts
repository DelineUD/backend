import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class IPostsFindQuery {
  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  lastIndex: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  group: string;
}
