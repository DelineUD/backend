import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UploadDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, required: false })
  @IsOptional()
  uploadedFiles?: any[];
}
