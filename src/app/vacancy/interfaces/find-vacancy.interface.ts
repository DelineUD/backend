import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class IFindAllVacancyParams {
  @ApiProperty({ default: '' })
  @IsString({ message: 'userId должен быть типа ObjectId!' })
  userId: Types.ObjectId; // Sys mongo _id
}

export class IFindOneVacancyParams extends PartialType(IFindAllVacancyParams) {
  @ApiProperty({ default: '' })
  @IsString({ message: 'id должен быть быть типа String!' })
  id: string; // Get course id
}
