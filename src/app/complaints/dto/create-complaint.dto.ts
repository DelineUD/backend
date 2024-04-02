import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsString } from 'class-validator';

import { ComplaintTypes } from '@app/complaints/consts';

export class CreateComplaintDto {
  @ApiProperty({ default: ComplaintTypes.POST, required: true })
  @IsString()
  type: ComplaintTypes;
  @ApiProperty({ required: true })
  @IsMongoId()
  id: string;
  @ApiProperty({ default: [], required: true })
  @IsArray()
  reason: string[];
}
