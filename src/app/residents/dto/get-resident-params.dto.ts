import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class GetResidentParamsDto {
  @ApiProperty({ default: '' })
  @IsMongoId()
  id: Types.ObjectId;
}
