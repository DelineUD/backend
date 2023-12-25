import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class IFindAllResumeParams {
  @ApiProperty({ default: '' })
  @IsString({ message: 'userId должен быть типа ObjectId!' })
  userId: Types.ObjectId; // Sys mongo id
}

export class IFindOneResumeParams extends PartialType(IFindAllResumeParams) {
  @ApiProperty({ default: '' })
  @IsString({ message: 'id должен быть типа String!' })
  id: string; // Get course id
}
