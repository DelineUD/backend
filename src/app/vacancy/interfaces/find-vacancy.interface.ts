import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IFindAllVacancyParams {
  @ApiProperty({ default: '' })
  @IsString({ message: 'userId должен быть строкой!' })
  userId: string; // User _id
}

export class IFindOneVacancyParams extends PartialType(IFindAllVacancyParams) {
  @ApiProperty({ default: '' })
  @IsString({ message: 'id должен быть строкой!' })
  id: string; // Vacancy id
}
