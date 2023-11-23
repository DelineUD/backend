import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ResumeDto } from './resume.dto';

export class UpdateResumeDto extends PartialType(ResumeDto) {
  /* For swagger - delete all when release */
  @ApiProperty({ default: 'Frontend Developer' })
  readonly title: string;
}
