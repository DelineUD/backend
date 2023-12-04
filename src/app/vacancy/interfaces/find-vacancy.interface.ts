import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class IFindAllVacancyParams {
  @ApiProperty({ default: '' })
  @IsString({ message: 'userId должен быть строкой!' })
  userId: Types.ObjectId; // User _id
}

export class IFindOneVacancyParams extends PartialType(IFindAllVacancyParams) {
  @ApiProperty({ default: '' })
  @IsString({ message: 'id должен быть строкой!' })
  id: Types.ObjectId; // Vacancy id
}
