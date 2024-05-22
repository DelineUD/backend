import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class IFindAllVacancyParams {
  @ApiProperty({ default: '' })
  @IsMongoId()
  userId: Types.ObjectId; // Sys mongo _id
}

export class IFindOneVacancyParams extends PartialType(IFindAllVacancyParams) {
  @ApiProperty({ default: '' })
  @IsMongoId()
  id: Types.ObjectId; // Sys mongo _id
}
