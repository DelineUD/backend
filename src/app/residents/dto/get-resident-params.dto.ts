import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class GetResidentParamsDto {
  @ApiProperty()
  _id: Types.ObjectId;
}
