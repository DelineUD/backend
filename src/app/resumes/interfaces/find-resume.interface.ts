import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class IFindAllResumeParams {
  @ApiProperty({ default: '' })
  @IsString({ message: 'userId должен быть строкой!' })
  userId: Types.ObjectId; // Sys mongo id
}

export class IFindOneResumeParams extends PartialType(IFindAllResumeParams) {
  @ApiProperty({ default: '' })
  @IsString({ message: 'id должен быть строкой!' })
  id: Types.ObjectId; // Sys mongo id
}
