import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class IFindAllResumeParams {
  @ApiProperty({ default: '' })
  @IsString()
  userId: Types.ObjectId; // Sys mongo id
}

export class IFindOneResumeParams extends PartialType(IFindAllResumeParams) {
  @ApiProperty({ default: '' })
  @IsMongoId()
  id: Types.ObjectId; // Sys mongo id
}
