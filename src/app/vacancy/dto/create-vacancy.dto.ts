import { ApiProperty, PartialType } from '@nestjs/swagger';

import { AuthorStatus } from '../consts';
import { VacancyDto } from './vacancy.dto';

export class CreateVacancyDto extends PartialType(VacancyDto) {
  /* For swagger - delete all when release */
  @ApiProperty({ default: '1' })
  readonly id: string;
  @ApiProperty({ default: 'Frontend Developer' })
  readonly title: string;
  @ApiProperty({ default: true })
  readonly remote: boolean;
  @ApiProperty({ default: AuthorStatus.EXPERT })
  readonly status: AuthorStatus;
  @ApiProperty({ default: 'https://telegram.org/' })
  readonly feedbackLink: string;

  @ApiProperty({ default: '' })
  readonly author: string;
}
