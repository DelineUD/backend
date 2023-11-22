import { ApiProperty, PartialType } from '@nestjs/swagger';

import { CreateVacancyDto } from './create-vacancy.dto';
import { AuthorStatus } from '../consts';

export class UpdateVacancyDto extends PartialType(CreateVacancyDto) {
  /* For swagger - delete all when release */
  @ApiProperty({ default: '1' })
  readonly id: string;
  @ApiProperty({ default: 'Frontend Developer' })
  readonly title: string;
  @ApiProperty({ default: true })
  readonly remote: boolean;
  @ApiProperty({ default: 'Новичок' })
  readonly status: AuthorStatus;
}
