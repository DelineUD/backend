import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class IVacancyFindAll {
  @ApiProperty({ default: '' })
  @IsMongoId()
  userId: string;
}

export class IVacancyFindOne extends PartialType(IVacancyFindAll) {
  @ApiProperty({ default: '' })
  @IsMongoId()
  id: string;
}
